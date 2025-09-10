"""
URL configuration for bdend1 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from .views import upload_pdf,signUp,signIn,send_otp,verify_otp

urlpatterns = [
    path("admin/", admin.site.urls),
    path('upload-pdf/', upload_pdf, name='upload_pdf'),
    path('api/sign-up/', signUp, name='sign-up'),
    path('api/sign-in/', signIn, name='sign-in'),
    path("api/send-otp/", send_otp, name="send-otp"),
    path("api/reset-password/", verify_otp, name="reset-password"),
]
