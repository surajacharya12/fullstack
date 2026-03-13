from django.contrib import admin
from .models import Blog

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'topic', 'author', 'created_at')
    list_filter = ('topic', 'author')
    search_fields = ('title', 'content')
