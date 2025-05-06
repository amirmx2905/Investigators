from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

def paginate(items, items_per_page, page_number):
    """
    Función de paginación manual para colecciones de elementos.
    
    Esta función permite paginar cualquier lista de elementos Python sin depender de Django.
    Útil para paginar datos que no provienen directamente de un QuerySet.
    
    Parámetros:
        items (list): Lista completa de elementos a paginar
        items_per_page (int): Cantidad de elementos por página
        page_number (int): Número de página solicitada (comienza en 1)
        
    Retorna un diccionario con:
        - items: Los elementos correspondientes a la página solicitada
        - total_items: Total de elementos en toda la colección
        - total_pages: Número total de páginas
        - current_page: Número de página actual
    """
    total_items = len(items)
    # Cálculo del número total de páginas, redondeando hacia arriba
    total_pages = (total_items + items_per_page - 1) // items_per_page
    
    # Cálculo de los índices de inicio y fin para la porción solicitada
    start_index = (page_number - 1) * items_per_page
    end_index = start_index + items_per_page
    
    # Extracción de los elementos para esta página
    paginated_items = items[start_index:end_index]

    # Estructura de respuesta
    return {
        'items': paginated_items,
        'total_items': total_items,
        'total_pages': total_pages,
        'current_page': page_number
    }

class CustomPageNumberPagination(PageNumberPagination):
    """
    Clase personalizada de paginación para las API REST del sistema.
    
    Extiende la paginación estándar de Django REST Framework para incluir
    información adicional útil para la interfaz de usuario, como el número
    total de páginas y la página actual.
    
    Configuración:
        - page_size: Número predeterminado de elementos por página (10)
        - page_size_query_param: Parámetro en la URL para cambiar el tamaño de página ('page_size')
        - max_page_size: Límite máximo de elementos por página (100)
    
    Ejemplo de uso en URL: /api/investigadores/?page=2&page_size=20
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        """
        Devuelve la respuesta paginada con información adicional.
        
        Además de los campos estándar (count, next, previous, results),
        incluye información útil como total_pages y current_page para
        facilitar la navegación en el frontend.
        
        Args:
            data: Los datos ya paginados a incluir en la respuesta
            
        Returns:
            Response: Objeto de respuesta con la estructura de paginación personalizada
        """
        return Response({
            'count': self.page.paginator.count,            # Número total de elementos
            'next': self.get_next_link(),                  # URL para la página siguiente
            'previous': self.get_previous_link(),          # URL para la página anterior
            'total_pages': self.page.paginator.num_pages,  # Número total de páginas
            'current_page': self.page.number,              # Número de la página actual
            'results': data                                # Datos de la página actual
        })
