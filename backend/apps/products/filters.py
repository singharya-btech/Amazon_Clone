from django_filters import rest_framework as filters
from .models import Product


class ProductFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = filters.NumberFilter(field_name='price', lookup_expr='lte')
    min_rating = filters.NumberFilter(method='filter_by_rating')
    category = filters.CharFilter(field_name='category__slug')
    brand = filters.CharFilter(lookup_expr='icontains')
    in_stock = filters.BooleanFilter(method='filter_in_stock')

    class Meta:
        model = Product
        fields = ['category', 'brand', 'is_featured', 'is_best_seller']

    def filter_by_rating(self, queryset, name, value):
        ids = [p.id for p in queryset if p.average_rating >= float(value)]
        return queryset.filter(id__in=ids)

    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock__gt=0)
        return queryset
