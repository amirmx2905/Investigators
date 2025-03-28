from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

def paginate(items, items_per_page, page_number):
    total_items = len(items)
    total_pages = (total_items + items_per_page - 1) // items_per_page
    start_index = (page_number - 1) * items_per_page
    end_index = start_index + items_per_page
    paginated_items = items[start_index:end_index]

    return {
        'items': paginated_items,
        'total_items': total_items,
        'total_pages': total_pages,
        'current_page': page_number
    }

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'results': data
        })