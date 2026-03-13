from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Blog
from .serializers import BlogSerializer
from rest_framework import generics
from .permissions import IsAuthorOrReadOnly


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        if email and User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "User created successfully",
            "user": UserSerializer(user).data,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username/Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Try to authenticate with username
        user = authenticate(username=username, password=password)

        # If username fails, try to treat 'username' as an email
        if user is None:
            try:
                user_obj = User.objects.get(email=username)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful",
                "user": UserSerializer(user).data,
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            # Handle profile specific fields (bio, avatar)
            # Support both nested {"profile": {"bio": ...}} and flat multipart {"bio": ...}
            profile_data = request.data.get('profile')
            bio = request.data.get('bio')
            avatar = request.data.get('avatar')
            
            p_data = {}
            if profile_data:
                # If it's a string (e.g. from some clients), might need parsing, 
                # but DRF usually handles it if it's JSON.
                if isinstance(profile_data, dict):
                    p_data.update(profile_data)
            
            if bio: p_data['bio'] = bio
            if avatar: p_data['avatar'] = avatar

            if p_data:
                from .serializers import ProfileSerializer
                profile_serializer = ProfileSerializer(user.profile, data=p_data, partial=True)
                if profile_serializer.is_valid():
                    profile_serializer.save()
            
            return Response(UserSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BlogListCreateView(generics.ListCreateAPIView):
    queryset = Blog.objects.all().order_by('-created_at')
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        queryset = Blog.objects.all().order_by('-created_at')
        topic = self.request.query_params.get('topic')
        if topic:
            return queryset.filter(topic=topic)
        return queryset

class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

class LikeBlogView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            blog = Blog.objects.get(pk=pk)
            if blog.likes.filter(id=request.user.id).exists():
                blog.likes.remove(request.user)
                return Response({"message": "Unliked", "is_liked": False}, status=status.HTTP_200_OK)
            else:
                blog.likes.add(request.user)
                return Response({"message": "Liked", "is_liked": True}, status=status.HTTP_200_OK)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)

class CommentCreateView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        blog_id = self.request.data.get('blog')
        blog = Blog.objects.get(id=blog_id)
        serializer.save(author=self.request.user, blog=blog)

class FollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        try:
            user_to_follow = User.objects.get(username=username)
            if user_to_follow == request.user:
                return Response({"error": "You cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)
            
            follow_obj, created = Follow.objects.get_or_create(follower=request.user, followed=user_to_follow)
            
            if not created:
                follow_obj.delete()
                return Response({"message": "Unfollowed", "is_following": False}, status=status.HTTP_200_OK)
            
            return Response({"message": "Following", "is_following": True}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
