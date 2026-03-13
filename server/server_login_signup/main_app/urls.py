from django.urls import path
from .views import (
    SignupView, LoginView, ProfileView, 
    BlogListCreateView, BlogDetailView,
    LikeBlogView, CommentCreateView, FollowUserView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('blogs/', BlogListCreateView.as_view(), name='blog-list-create'),
    path('blogs/<int:pk>/', BlogDetailView.as_view(), name='blog-detail'),
    path('blogs/<int:pk>/like/', LikeBlogView.as_view(), name='blog-like'),
    path('comments/', CommentCreateView.as_view(), name='comment-create'),
    path('follow/<str:username>/', FollowUserView.as_view(), name='follow-user'),
]


