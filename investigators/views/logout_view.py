from django.http import HttpResponseRedirect
from django.urls import reverse

def logout_view(request):
    request.session.flush()
    response = HttpResponseRedirect(reverse('login'))
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'

    return response