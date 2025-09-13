# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.core.cache import cache

from pymongo import MongoClient
import gridfs
from bson import ObjectId
from pdf2image import convert_from_bytes
from io import BytesIO
import pytesseract
import json
import random

from .models import User
from .prediction import predict_disease, EXPECTED_FEATURES

# ---------------- MongoDB Connection ---------------- #
client = MongoClient("mongodb://localhost:27017/")
db = client["MedForecast"]
fs = gridfs.GridFS(db)

OTP_EXPIRY_TIME = 300  # 5 minutes


# ---------------- Helper Functions ---------------- #
def fetch_user_from_postgresql(email):
    user = User.objects.filter(email=email).first()
    return user.id if user else None


def process_pdf_from_gridfs(pdf_id):
    """Retrieve the uploaded PDF from GridFS, convert to images, and extract text."""
    try:
        pdf_file = fs.get(ObjectId(pdf_id))
        pdf_bytes = BytesIO(pdf_file.read())
        pdf_images = convert_from_bytes(pdf_bytes.read(), dpi=300)

        extracted_text = ""
        for image in pdf_images:
            extracted_text += pytesseract.image_to_string(image)

        return {f: 0 for f in EXPECTED_FEATURES}  
    except Exception as e:
        print(f"Error processing PDF ({pdf_id}): {str(e)}")
        return {f: 0 for f in EXPECTED_FEATURES}



@csrf_exempt
def upload_pdf(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method."}, status=405)

    user_email = request.POST.get("email")
    user_name = request.POST.get("name")
    pdf_file = request.FILES.get("file")

    if not user_email or not pdf_file:
        return JsonResponse({"error": "Email and file are required"}, status=400)

    # Check PostgreSQL user or create in MongoDB
    user_id = fetch_user_from_postgresql(user_email)
    if user_id:
        user_metadata = {"user_id": user_id, "email": user_email}
    else:
        user = db.users.find_one({"email": user_email})
        if not user:
            user = {"email": user_email, "name": user_name}
            db.users.insert_one(user)
        user_metadata = {"email": user_email}

    try:
        pdf_id = fs.put(pdf_file, filename=pdf_file.name, **user_metadata)
        extracted_features = process_pdf_from_gridfs(pdf_id)

        db.processed_pdfs.insert_one({
            "pdf_id": str(pdf_id),
            "email": user_email,
            "extracted_text": extracted_features
        })

        return JsonResponse({"message": "PDF uploaded and processed successfully", "pdf_id": str(pdf_id)})
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)


@api_view(['GET'])
def predict_pdf_disease(request, pdf_id):
    """Predict disease from a previously uploaded PDF by its PDF ID."""
    try:
        predicted_disease = predict_disease(pdf_id)
        return JsonResponse({"pdf_id": pdf_id, "predicted_disease": predicted_disease})
    except Exception as e:
        return JsonResponse({"error": f"Prediction failed: {str(e)}"}, status=500)


# ---------------- User Signup & Login ---------------- #
@csrf_exempt
@api_view(['POST'])
def signUp(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method."}, status=405)
    try:
        data = json.loads(request.body)
        required_fields = ['firstname', 'lastname', 'age', 'dob', 'gender', 'email', 'password', 'confirmpassword']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)

        if data['password'] != data['confirmpassword']:
            return JsonResponse({"error": "Passwords do not match."}, status=400)

        if User.objects.filter(email=data['email']).exists():
            return JsonResponse({"error": "Email already exists."}, status=400)

        user = User.objects.create(
            firstname=data['firstname'],
            lastname=data['lastname'],
            age=int(data['age']),
            dob=data['dob'],
            gender=data['gender'],
            email=data['email'],
            password=make_password(data['password'])
        )
        return JsonResponse({"message": "User registered successfully!", "user_id": user.id}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@api_view(['POST'])
def signIn(request):
    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        if not email or not password:
            return JsonResponse({"error": "Email and password are required."}, status=400)
        user = authenticate(request, username=email, password=password)
        if user:
            return JsonResponse({"message": "Login successful"}, status=200)
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ---------------- OTP ---------------- #
@csrf_exempt
@api_view(['POST'])
def send_otp(request):
    try:
        data = json.loads(request.body)
        email = data.get("email")
        if not email:
            return JsonResponse({"error": "Email is required"}, status=400)

        otp = random.randint(100000, 999999)
        cache.set(f"otp_{email}", otp, OTP_EXPIRY_TIME)

        send_mail(
            "Your OTP",
            f"Your OTP is {otp}",
            "your-email@gmail.com",
            [email],
            fail_silently=False
        )

        return JsonResponse({"message": "OTP sent successfully"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@api_view(['POST'])
def verify_otp(request):
    try:
        data = json.loads(request.body)
        email = data.get("email")
        entered_otp = data.get("otp")
        new_password = data.get("new_password")
        confirm_password = data.get("confirm_password")

        if not email or not entered_otp or not new_password or not confirm_password:
            return JsonResponse({"error": "Missing required fields"}, status=400)

        if new_password != confirm_password:
            return JsonResponse({"error": "Passwords do not match"}, status=400)

        stored_otp = cache.get(f"otp_{email}")
        if stored_otp is None or str(stored_otp) != str(entered_otp):
            return JsonResponse({"error": "Invalid or expired OTP"}, status=400)

        user = User.objects.get(email=email)
        user.password = make_password(new_password)
        user.save()
        cache.delete(f"otp_{email}")

        return JsonResponse({"message": "Password reset successful"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
