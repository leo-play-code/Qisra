from pathlib import Path
import os
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '+f(#3&pcejhb#sh*e0)8nwb(c81$tsirfw-=bd7#w#9y0$ckz4'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["0f19-1-160-243-189.jp.ngrok.io","127.0.0.1"]
CSRF_TRUSTED_ORIGINS = ['https://0f19-1-160-243-189.jp.ngrok.io','http://127.0.0.1']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'main.apps.MainConfig',
    'testcase.apps.TestcaseConfig',
    'testplan.apps.TestplanConfig',
    'project.apps.ProjectConfig',
    'ckeditor',
    'ckeditor_uploader',
    'django.contrib.sites',
    'simple_history',
    'require',
    


]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'simple_history.middleware.HistoryRequestMiddleware',
]

ROOT_URLCONF = 'Qisra.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                "Qisra.context_processors.settings_template",
            ],
        },
    },
]

WSGI_APPLICATION = 'Qisra.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Taipei'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = "/static/"
# MEDIA_URL = '/images/'
MEDIA_URL = '/images/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR,'static')
]


CKEDITOR_BASEPATH = '/static/ckeditor/ckeditor/'
# Added the CKEDITOR Upload Path
DJANGO_WYSIWYG_FLAVOR = "ckeditor"
CKEDITOR_JQUERY_URL = 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js'
CKEDITOR_RESTRICT_BY_USER = True #Only who upload image see it
CKEDITOR_UPLOAD_PATH = 'uploads/'
CKEDITOR_BROWSE_SHOW_DIRS = True # Shows directory of image in the server
CKEDITOR_RESTRICT_BY_DATE = True # Arranges image in terms of date uploaded
CKEDITOR_IMAGE_BACKEND = "pillow"


CKEDITOR_CONFIGS = {
   'default': {
       'toolbar_Full': [
            ['Styles', 'Format', 'Bold', 'Italic', 'Underline', 'Strike', 'SpellChecker', 'Undo', 'Redo'],
            # ['Flash', 'Table', 'HorizontalRule'],
            # ['TextColor', 'BGColor'],
            # ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
            # ['NumberedList','BulletedList'],
            # ['Indent','Outdent'],
            # ['Maximize'],
        ],
        'extraPlugins': 'indent,filebrowser',
        "removePlugins": "exportpdf",
        'width':500,
        'height':200,
   },
}

SITE_ID=1


