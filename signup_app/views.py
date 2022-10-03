from re import T
from django.shortcuts import render
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from signup_app.forms import SignUpForm
from django.contrib.auth.models import User
from django.contrib import auth
from django.contrib.auth import logout
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.http import HttpResponseRedirect,HttpResponse,JsonResponse
from validate_email import validate_email
from signup_app.models import Verify_email_code

# random verify code import 
import string
import random


# email send import 
from django.contrib.auth.hashers import make_password
from email.mime.multipart import MIMEMultipart
import smtplib
from email.mime.text import MIMEText
from matplotlib.style import context
from validate_email import validate_email
from datetime import datetime as dt2

def id_generator(size=6, chars=string.digits):
   return ''.join(random.choice(chars) for _ in range(size))
def signup(request):
    form = SignUpForm()
    if request.method == 'POST':
        if 'login' in request.POST:
            lastname = request.POST['username']
            password = request.POST['password1']
            if '@' in lastname:
                lastname = lastname.lower()
                user = User.objects.get(last_name=lastname)
                if user.is_active == False:
                    return JsonResponse({'error':'is_not_active'})
                success = user.check_password(password)
                if success:
                    login(request, user)
                else:
                    return JsonResponse({'error':'loginerror'})
            else:
                # user = auth.authenticate(username=username, password=password)
                return JsonResponse({'error':'loginerror'})
            login(request, user)
            return redirect('Dashboard')  
        elif 'register' in request.POST:
            email = request.POST['email']
            lastname = request.POST['email'].lower()
            username = lastname.replace('@qisda.com', '')
            password = request.POST['password1']
            if 'Qisda.com' in email:
                pass
            else:
                email_is_valid = validate_email(email,verify=True)
                if email_is_valid != True:
                    return JsonResponse({'error':'email_invalid'})
            filter = None
            try:
                User.objects.get(username=username)
                filter = 'username_exists'
            except:
                try:
                    User.objects.get(email=email)
                    filter = 'email_exists'
                except:pass
            if filter == None:
                print('create user email = ',email)
                user = User.objects.create_user(
                    username=username, email=email, password=password, last_name=lastname)
                user.is_active = False
                user.save()
                # user = authenticate(username=username, password=password)
                return JsonResponse({'error':'wait_accept'})
                # login(request, user)
                # return redirect('Dashboard') 
            else:
                if 'username' in filter:
                    return JsonResponse({'error':'username'})
                elif 'email' in filter:
                    return JsonResponse({'error':'email'})
                pass
        elif 'get_verify_code' in request.POST:
            email = request.POST['email']
            user = User.objects.get(email = email)
            verify_code = id_generator()
            Verify_email_code.objects.filter(user=user).delete()
            Verify_email_code.objects.create(user=user,code=verify_code)
            #  send email
            msg_content = '<p>驗證碼:</p><h2><font color="green">{verify_code}</font></h2>\n'.format(verify_code=verify_code)
            content = MIMEMultipart()  #建立MIMEMultipart物件
            content["subject"] ="[Qisra]密碼重設"  #郵件標題
            content["from"] = "ddmtestanswer@gmail.com"  #寄件者
            content["to"] = email #收件者
            content.attach(MIMEText(msg_content, 'html'))  #郵件內容
            # is_valid = validate_email(email,verify=True)
            # if is_valid==True:
            with smtplib.SMTP(host="smtp.gmail.com", port="587") as smtp:  # 設定SMTP伺服器
                try:
                    smtp.ehlo()  # 驗證SMTP伺服器
                    smtp.starttls()  # 建立加密傳輸
                    smtp.login("ddmtestanswer@gmail.com", "ougzpuamzcstjjqn")  # 登入寄件者gmail
                    smtp.send_message(content)  # 寄送郵件
                    print("Complete!")
                except Exception as e:
                    print("Error message: ", e)
            # else:
            #     print("This mail doesnt exists")
        elif 'accurate_verify_code' in request.POST:
            email = request.POST['email']
            user = User.objects.get(email = email)
            verify_code = id_generator()
            ans_code = Verify_email_code.objects.get(user=user).code
            print(ans_code,request.POST['code'])
            if str(ans_code) == str(request.POST['code']):
                return JsonResponse({'code':'True'})
            else:
                return JsonResponse({'code':'False'})
        elif 'new_password' in request.POST:
            print('reset?')
            user = User.objects.get(email=request.POST['email'])
            user.password = make_password(request.POST['new_password'])
            user.save()      
            login(request, user)      
    else:
        logout(request)
    return render(request, 'signup_app/register.html', {'form': form})

