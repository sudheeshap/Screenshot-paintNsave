
from django.http import HttpResponse
from django.shortcuts import render_to_response
from paint_it.models import Drawing

def home(request):
    if request.method == 'GET':
        return render_to_response('home.html')
    elif request.method == 'POST':
        img = request.POST['img']
        pic = Drawing(image=img)
        pic.save()
        pic = Drawing.objects.get(id=pic.id)
        return HttpResponse(pic.id)
    
def show_pic(request, pic_id):
    pic = Drawing.objects.get(id=pic_id)
    return render_to_response('show.html', {'image': pic.image})
   







