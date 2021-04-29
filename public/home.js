$(function(){
    // This code is not even almost production ready. It's 2am here, and it's a cheap proof-of-concept if anything.
    $(".img-modal-btn.right").on('click', function(e){
        e.preventDefault();
        cur = $(this).parent().find('img:visible()');
        next = cur.next('img');
        par = cur.parent();
        if (!next.length) { next = $(cur.parent().find("img").get(0)) }
        cur.addClass('hidden');
        next.removeClass('hidden');
        
        return false;
    })
    
    $(".img-modal-btn.left").on('click', function(e){
        e.preventDefault();
        cur = $(this).parent().find('img:visible()');
        next = cur.prev('img');
        par = cur.parent();
        children = cur.parent().find("img");
        if (!next.length) { next = $(children.get(children.length-1)) }
        cur.addClass('hidden');
        next.removeClass('hidden');
        
        return false;
    })

});