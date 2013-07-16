var board = document.getElementById("real_canvas");
var tmp_board = document.getElementById("temp_canvas");
var b_width = screen.width, b_height = screen.height;
var ctx = board.getContext("2d"), tmp_ctx = tmp_board.getContext("2d");
var x, y, saved = false, hold = false, fill = false, stroke = true, tool;
tmp_ctx.lineCap = 'round';
ctx.lineCap = 'round';
colors = ['#000000', '#ff0000', '#ff7f00', '#ffff00', 
          '#ffffff', '#008800', '#0000ff', '#8b00ff'];

$(document).ready(function(){
  $("#upload_btn").click(function(){
    $.post("/", {img: board.toDataURL("image/jpeg")}, function(data, status){
      if(status) {
        pic_name = ("http://paintonit.herokuapp.com/" + data + 
                   "pic" + make_text() + ".jpg").replace(" ", "");
        $("#my_url").append($("<a href=" + pic_name + ">" + pic_name + "</a>"));
        $("#msg_box").bPopup();//Shows the saved URL.
      }
    });
    $("#my_url").empty();
  });
  // Paste the image from clipboard to the page.
  document.onpaste = function(){
    var source;
    var items = event.clipboardData.items;
    $("#msg").show();
    if(items.length > 0){  //If there is data in clipboard.
      if(!(items[0].type.match(/^image/))) {//If clipboard data is not an image.
        $("#msg").text("Press the PrtScn key first!"); 
        return;
      } 
      $("#paste_box").hide();
      $("#real_canvas").show();
      $("#temp_canvas").show();
      $("#tool_box").show();
      var blob = items[0].getAsFile();
      var reader = new FileReader();
      reader.onload = function(event){
        var img = new Image();
        img.src = event.target.result;
        $(img).load(function(){ //Draws screenshot onto the canvas.
          board.width = tmp_board.width = img.width/1.12;
          board.height = tmp_board.height = img.height/1.12;
          ctx.drawImage(img, 0, 0, screen.width/1.12, screen.height/1.12); 
        });
      };   
      reader.readAsDataURL(blob); 
    }
    else
      $("#msg").text("Nothing to paste!");
      event.preventDefault();
  };

  $("#new_btn").click(function(){
    ctx.clearRect(0, 0, screen.width, screen.height);
    tmp_ctx.clearRect(0, 0, screen.width, screen.height);
    $("#tool_box").hide();
    $("#real_canvas").hide();
    $("#temp_canvas").hide();
    $("#msg").hide();
    $("#paste_box").show();
    tool = '';
    
  });  

  $("#line").click(function(){ tool ="line"; });
  $("#rect").click(function(){ tool ="rectangle"; });
  $("#circle").click(function(){ tool ="circle"; });
  $("#pencil").click(function(){ tool ="pencil"; });
  $("#eraser").click(function(){ tool ="eraser"; });
  $("#thick").change(function(){thickness();});

  //Generates color bottons.
  for (i in colors){
    $("#fill_row").append($("<button/>", {id: colors[i],
        "class": 'colors', click: function(){fill_color($(this)[0].id);} })
                            .css({"background-color": colors[i]})
    );
  }
  for (i in colors){
    $("#outline_row").append($("<button/>", {id: colors[i],
         "class": 'colors', click: function(){line_color($(this)[0].id);} })
                            .css({"background-color": colors[i]})
    );
  }
  
  tmp_board.onmousedown = function(e) {
        attributes();
        hold = true;
        x = e.layerX - this.offsetLeft;
        y = e.layerY -this.offsetTop;
        begin_x = x;
        begin_y = y;
        tmp_ctx.beginPath();
        tmp_ctx.moveTo(begin_x, begin_y);    
  }

  tmp_board.onmousemove = function(e) {
        if (x == null || y == null) {
          return;
        }
        if(hold){
          x = e.layerX - this.offsetLeft;
          y = e.layerY - this.offsetTop;
          goDraw();
        }
  }
     
  tmp_board.onmouseup = function(e) {
        ctx.drawImage(tmp_board,0, 0);
        tmp_ctx.clearRect(0, 0, tmp_board.width, tmp_board.height);
        end_x = x;
        end_y = y;
        x = null;
        y = null;
        goDraw();
        hold = false;
  }

  function attributes(){
    if ($("#fill").is(':checked'))
      fill = true;
    else
      fill = false;
    if ($("#outline").is(':checked'))
      stroke = true;
    else
      stroke = false;
  }

  function thickness(){
    tmp_ctx.lineWidth = $("#thick").val();
  }

  function clears(){
    ctx.clearRect(0, 0, b_width, b_height);
    tmp_ctx.clearRect(0, 0, b_width, b_height);
  }

  function line_color(scolor){  
    if ($("#outline").is(':checked'))
      tmp_ctx.strokeStyle = scolor;
  }

  function fill_color(fcolor){
    if ($("#fill").is(':checked'))
      tmp_ctx.fillStyle =  fcolor;
  }

  function brush(){  
    if(!x && !y)
      return; 
    tmp_ctx.lineTo(x, y);
    tmp_ctx.stroke();
    begin_x = x;
    begin_y = y;
  }

  function goDraw(){
    if (tool == 'pencil'){
      brush();  
    }
    else if (tool == 'line'){ 
      if(!x && !y)
        return;
      tmp_ctx.clearRect(0, 0, b_width, b_height);
      tmp_ctx.beginPath();
      tmp_ctx.moveTo(begin_x, begin_y);
      tmp_ctx.lineTo(x, y);
      tmp_ctx.stroke();
      tmp_ctx.closePath();
    }
    else if (tool == 'rectangle'){
      if(!x && !y)
        return;  
      tmp_ctx.clearRect(0, 0, b_width, b_height);
      tmp_ctx.beginPath();
      if(stroke)
        tmp_ctx.strokeRect(begin_x, begin_y, x-begin_x, y-begin_y);
      if(fill) 
        tmp_ctx.fillRect(begin_x, begin_y, x-begin_x, y-begin_y);
      tmp_ctx.closePath();
    }
    else if (tool == 'circle'){   
      if(!x && !y)
        return;   
      tmp_ctx.clearRect(0, 0, b_width, b_height);
      tmp_ctx.beginPath();
      tmp_ctx.arc(begin_x, begin_y, Math.abs(x-begin_x),0 ,2 * Math.PI, false);
      if(stroke) 
        tmp_ctx.stroke();
      if(fill) 
        tmp_ctx.fill();
      tmp_ctx.closePath();
    }
    else if (tool == 'eraser'){
      tmp_ctx.strokeStyle = '#ffffff';
      brush();  
      tmp_ctx.strokeStyle = '#000000';
    }
  } 
  function make_text(){
    var text = "";
    var source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcde\
                  fghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
      text += source.charAt(Math.floor(Math.random() * source.length));
    return text;
  }  
});

