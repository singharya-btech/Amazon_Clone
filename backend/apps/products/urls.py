from django.urls import path
from .views import (
    CategoryListView, CategoryDetailView, ProductListView, ProductDetailView,
    FeaturedProductsView, BestSellersView, CategoryProductsView, ReviewListCreateView
)

urlpatterns = [
    path('', ProductListView.as_view(), name='product_list'),
    path('featured/', FeaturedProductsView.as_view(), name='featured_products'),
    path('best-sellers/', BestSellersView.as_view(), name='best_sellers'),
    path('categories/', CategoryListView.as_view(), name='category_list'),
    path('categories/<slug:slug>/', CategoryDetailView.as_view(), name='category_detail'),
    path('categories/<slug:slug>/products/', CategoryProductsView.as_view(), name='category_products'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='product_detail'),
    path('<slug:slug>/reviews/', ReviewListCreateView.as_view(), name='product_reviews'),
]
