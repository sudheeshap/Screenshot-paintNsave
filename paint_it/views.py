
from django.http import HttpResponse
from django.shortcuts import render_to_response
from paint_it.models import Drawing

def home(request):
    if request.method == 'GET':
        return render_to_response('home.html')
    elif request.method == 'POST':
        name = request.POST['fname']
        img = request.POST['img']
        pic = Drawing(fname=name, image=img)
        pic.save()
        return HttpResponse(name)
    
def show_pic(request, pic_name):
    pic = Drawing.objects.get(fname=str(pic_name))
    return render_to_response('show.html', {'image': pic.image})
   







