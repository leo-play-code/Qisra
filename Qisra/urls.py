from django.contrib import admin
from django.urls import path,include,re_path
from django.http import HttpResponse


urlpatterns = [
    path('admin/', admin.site.urls),
    path("",include('main.urls')),
    path('testcase/',include('testcase.urls')),
    path("testplan/",include('testplan.urls')),
    path("project/",include('project.urls')),
    re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
]
