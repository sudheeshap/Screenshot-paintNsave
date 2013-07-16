import math
import random
from django.http import Http404
from django.http import HttpResponse
from django.shortcuts import render_to_response
from paint_it.models import Drawing

def home(request):
    if request.method == 'GET':
        return render_to_response('home.html')
    elif request.method == 'POST':
        img = request.POST['img']
        name = make_text()
        pic = Drawing(fname=name, image=img)
        pic.save()
        return HttpResponse(name + "g" + str(pic.id))
    
def show_pic(request, pic_name):
    try:
        pic = Drawing.objects.get(fname=str(pic_name))
    except Drawing.DoesNotExist:
        raise Http404
    return render_to_response('show.html', {'image': pic.image})
   
def make_text():
    text = ""
    source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for i in range(8):
        text += source[int(math.floor(random.random() * len(source)))]
    return text  






