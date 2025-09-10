from pymongo import MongoClient
from pdf2image import convert_from_path
from io import BytesIO
from bson import ObjectId
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from django.http import JsonResponse
from .models import User  
from django.core.mail import send_mail
from django.core.cache import cache
from nltk import word_tokenize
import pytesseract
import gridfs
import json
import random

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")  # Replace with your MongoDB URI
db = client["MedForecast"]  # Replace with your database name
fs = gridfs.GridFS(db)


def fetch_user_from_postgresql(email):
    """
    Fetch user from PostgreSQL database by email.
    Returns the user ID or None if the user does not exist.
    """
    user = User.objects.filter(email=email).first()
    if user:
        return user.id  # or any unique identifier
    return None


@csrf_exempt
@api_view(['POST'])
def signUp(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        firstname = data.get('firstname')
        lastname = data.get('lastname')
        age = data.get('age')
        dob = data.get('dob')
        gender = data.get('gender')
        email = data.get('email')
        password = data.get('password')
        confirmpassword = data.get('confirmpassword')

        required_fields = ['firstname', 'lastname', 'age', 'dob', 'gender', 'email', 'password', 'confirmpassword']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)

        print("Received data : ", data)

        if password != confirmpassword:
            return JsonResponse({"error": "Passwords do not match."}, status=400)

        try:
            age = int(age)
        except ValueError:
            return JsonResponse({"error": "Invalid age format."}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists."}, status=400)

        try:
            # Create new user
            user = User.objects.create(
                firstname=firstname,
                lastname=lastname,
                age=age,
                dob=dob,
                gender=gender,
                email=email,
                password=make_password(password)  # Securely hash the password
            )

            return JsonResponse({"message": "User registered successfully!", "user_id": user.unique_id}, status=201)

        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {e}"}, status=500)
    return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
@api_view(['POST'])
def signIn(request):
    data = json.loads(request.body)
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return JsonResponse({'error': 'Email and password are required.'}, status=400)
    print(data)

    user = authenticate(request, username=email, password=password)
    if user is not None:
        return JsonResponse({'message': 'Login successful!'}, status=200)
    else:
        return JsonResponse({'error': 'Invalid email or password.'}, status=400)

OTP_EXPIRY_TIME = 300 

@api_view(["POST"])
@csrf_exempt
def send_otp(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")

            if not email:
                return JsonResponse({"error": "Email is required"}, status=400)

            # Generate a 6-digit OTP
            otp = random.randint(100000, 999999)
            cache.set(f"otp_{email}", otp, OTP_EXPIRY_TIME)
            print(f"OTP for {email}: {otp}")

            # Ensure the message is properly encoded
            subject = "Your OTP for Password Reset"
            message = f"Your OTP is {otp}. Please use this to reset your password.".encode("utf-8").decode("utf-8")
            from_email = "your-email@gmail.com"
            recipient_list = [email]

            send_mail(subject, message, from_email, recipient_list, fail_silently=False)

            return JsonResponse({"message": "OTP sent successfully!"})

        except Exception as e:
            return JsonResponse({"error": f"Failed to send email: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

@api_view(["POST"])
@csrf_exempt
def verify_otp(request):
    """Verify the OTP and reset the password."""
    if request.method =='POST':
        try:
            data = json.loads(request.body)
            email = data.get("email")
            entered_otp = data.get("otp")
            new_password = data.get("new_password")
            confirm_password = data.get("confirm_password")

            # Validate Input
            if not email or not entered_otp or not new_password or not confirm_password:
                return JsonResponse({"error": "Email, OTP, and passwords are required"}, status=400)

            if new_password != confirm_password:
                return JsonResponse({"error": "Passwords do not match"}, status=400)

            # Retrieve Stored OTP from Cache
            stored_otp = cache.get(f"otp_{email}")
            print(f"Stored OTP for {email}: {stored_otp}")  # Debugging Output

            if stored_otp is None:
                return JsonResponse({"error": "Invalid or expired OTP"}, status=400)

            # Verify OTP
            if str(entered_otp) != str(stored_otp):
                return JsonResponse({"error": "Invalid OTP"}, status=400)

            # Reset Password
            try:
                user = User.objects.get(email=email)  # Find user by email
                user.password = make_password(new_password)  # Hash new password
                user.save()

                # Delete OTP from Cache
                cache.delete(f"otp_{email}")

                return JsonResponse({"message": "Password reset successful!"})
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)

        except Exception as e:
            return JsonResponse({"error": f"Error verifying OTP: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

def process_pdf_from_gridfs(pdf_id):
    """
    Retrieve the uploaded PDF from GridFS, convert it to images, and extract text using pytesseract.
    """
    try:
        # Retrieve the PDF from GridFS
        pdf_file = fs.get(ObjectId(pdf_id))

        # Convert the PDF to images
        pdf_bytes = BytesIO(pdf_file.read())  # Read the PDF as a byte stream
        pdf_images = convert_from_path(pdf_bytes, dpi=300)  # Convert to images

        # Extract text from each image using pytesseract
        extracted_text = ""
        for image in pdf_images:
            extracted_text += pytesseract.image_to_string(image)

        # Perform additional processing (e.g., storing the text, analyzing data, etc.)
        print(f"Extracted text from PDF ({pdf_id}): {extracted_text[:500]}...")  # Logging
        return extracted_text

    except Exception as e:
        print(f"An error occurred while processing the PDF ({pdf_id}): {str(e)}")
        return None


@method_decorator(csrf_exempt, name="dispatch")
def upload_pdf(request):
    if request.method == "POST":
        user_email = request.POST.get("email")  # Email from the frontend
        user_name = request.POST.get("name")  # Name from the frontend
        pdf_file = request.FILES.get("file")  # File from the frontend

        if not user_email or not pdf_file:
            return JsonResponse({"error": "Email and file are required"}, status=400)

        # Step 1: Check if the user exists in PostgreSQL
        user_id = fetch_user_from_postgresql(user_email)
        if user_id:
            # User exists in PostgreSQL
            user_metadata = {"user_id": user_id, "email": user_email}
        else:
            # Step 2: Check if the user exists in MongoDB
            user = db.users.find_one({"email": user_email})
            if not user:
                # Create a new user in MongoDB if they don't exist
                user = {"email": user_email, "name": user_name}  # Add more fields if needed
                db.users.insert_one(user)
            user_metadata = {"email": user_email}

        try:
            # Step 3: Store the PDF in GridFS with metadata
            pdf_id = fs.put(pdf_file, filename=pdf_file.name, **user_metadata)

            # Step 4: Automatically process the PDF after storing
            extracted_text = process_pdf_from_gridfs(pdf_id)

            # Optional: Store the extracted text in MongoDB
            db.processed_pdfs.insert_one({
                "pdf_id": str(pdf_id),
                "email": user_email,
                "extracted_text": extracted_text
            })

            return JsonResponse({"message": "PDF uploaded and processed successfully", "pdf_id": str(pdf_id)})
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
