from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Blog, Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar', 'bio']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'profile']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        Profile.objects.create(user=user)
        return user

class BlogSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')
    author_avatar = serializers.ImageField(source='author.profile.avatar', read_only=True)

    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'topic', 'image', 'author', 'author_name', 'author_avatar', 'created_at', 'updated_at']
        read_only_fields = ['author', 'created_at', 'updated_at']
