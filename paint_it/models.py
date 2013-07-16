from django.db import models

class Drawing(models.Model):
    fname = models.CharField(max_length=20)
    image = models.TextField()
