from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("users/<int:pk>/", views.UserDetail.as_view()),
    path('users/', views.UserList.as_view(), name='list-of-users'),
    path('users/', views.login, name='login')
]
