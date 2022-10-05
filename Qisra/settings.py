
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

ALLOWED_HOSTS = ['0.0.0.0', 'localhost', 'qisrabeta2.herokuapp.com',
                 "127.0.0.1"]
CSRF_TRUSTED_ORIGINS = ['http://127.0.0.1',
                        'https://qisrabeta2.herokuapp.com/']
# root of url
ROOT_URL = 'http://127.0.0.1:8000'
# 
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
    'signup_app.apps.SignupAppConfig',
    'ckeditor',
    'ckeditor_uploader',
    'django.contrib.sites',
    'simple_history',
    'require',
    
    'whitenoise.runserver_nostatic',
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
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
'''
dbsqlite3 database
'''
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
import dj_database_url
db_from_env = dj_database_url.config(conn_max_age=600)
DATABASES['default'].update(db_from_env)
'''
local progresSQL
'''
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'QISRA_project_detail',
#         'USER': 'postgres',
#         'PASSWORD': 'leo0514065',
#         'HOST': 'localhost',
#         'POST': '5432'
#     }
# }
#  Aws progresSQL
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'Qisra_beta1',
#         'USER': 'leo',
#         'PASSWORD': 'leo0514065',
#         'HOST': 'database-1.ccxxqtq9val3.ap-northeast-1.rds.amazonaws.com',
#         'POST': '5432'
#     }
# }
'''
Heroku
'''
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'dbi618n18i94bh',
#         'USER': 'gdmdzjmatbzipn',
#         'PASSWORD': '09b9ef9c1f5bb54c6dc7a7c7d81e9fe346dbbc2f20cd68d7e133f35d4b533626',
#         'HOST': 'ec2-52-200-5-135.compute-1.amazonaws.com',
#         'POST': '5432'
#     }
# }




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
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
# STATIC_ROOT = "/static/"
STATIC_URL = '/static/'

# MEDIA_URL = '/images/'
MEDIA_URL = '/media/'
# MEDIA_ROOT = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR,'media')
# print(os.path.join(BASE_DIR,'static'))
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static')
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
           ['Bold', 'Italic', 'Underline', 'Strike', 'SpellChecker',
               'Image', 'Styles', 'Format', 'Undo', 'Redo'],
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


LOGIN_URL = reverse_lazy('signup_url')

SIMPLE_HISTORY_REVERT_DISABLED=False


STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


# add tag url is fail to connect
# APPEND_SLASH=False