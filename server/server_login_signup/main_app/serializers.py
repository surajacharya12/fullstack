from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Blog, Profile, Comment, Follow

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')
    author_avatar = serializers.ImageField(source='author.profile.avatar', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'blog', 'author', 'author_name', 'author_avatar', 'text', 'created_at']
        read_only_fields = ['author', 'created_at']

class ProfileSerializer(serializers.ModelSerializer):
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    total_likes = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['avatar', 'bio', 'follower_count', 'following_count', 'total_likes']

    def get_follower_count(self, obj):
        return obj.user.followers.count()

    def get_following_count(self, obj):
        return obj.user.following.count()

    def get_total_likes(self, obj):
        from .models import Blog
        blogs = Blog.objects.filter(author=obj.user)
        return sum(blog.likes.count() for blog in blogs)

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile = ProfileSerializer(read_only=True)
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'profile', 'is_following']

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Follow.objects.filter(follower=request.user, followed=obj).exists()
        return False

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
    author_id = serializers.ReadOnlyField(source='author.id')
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'topic', 'image', 'author', 'author_name', 'author_id', 'author_avatar', 'likes_count', 'is_liked', 'is_following', 'comments', 'created_at', 'updated_at']
        read_only_fields = ['author', 'created_at', 'updated_at']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from .models import Follow
            return Follow.objects.filter(follower=request.user, followed=obj.author).exists()
        return False
