from django.conf import settings
from django.contrib import admin
from django.urls import path,include,re_path
from django.http import HttpResponse
from django.conf.urls.static import static 
urlpatterns = [
    path('admin/', admin.site.urls),
    path("",include('main.urls')),
    path('testcase/',include('testcase.urls')),
    path("testplan/",include('testplan.urls')),
    path("project/",include('project.urls')),
    path("vister/",include('signup_app.urls')),
] 

urlpatterns+= static(settings.MEDIA_URL,document_root = settings.MEDIA_ROOT)
