from ckeditor_uploader.fields import RichTextUploadingField
from django import forms
from ckeditor.widgets import CKEditorWidget
from ckeditor_uploader.widgets import CKEditorUploadingWidget


class modal_descriptionForm(forms.Form):
    create_description = forms.CharField(widget=CKEditorWidget())
