
$(document).ready(function(){
    let block = $('.block');
    let minSt =0;
    let secBk = 0;
    let timeBack;
    let minStart = 1;
    let secBack = 0;
    let startTime = true;
    const column = 4;
    const row = 4;
    let k = 0;
    let j = 0;
    let arr = [];
    let check = true;
    
    for (let i = 0; i< $('.puzzle').length; i++){
        k = parseInt(i%column);
        j = parseInt(i/row); 
        $('.puzzle').eq(i).css('backgroundPosition', (300 - k * 75) + 'px ' + (300- j * 75) + 'px');
        $('.puzzle').eq(i).val(i);
        arr.push([ (300 - k * 75)-75 + 'px ', (300- j * 75)-75 + 'px']);       
        $('.puzzle').eq(i).attr('data-id',i);       
    }

    mixPuz();
    draggabled();
    droppabled();
    
function swap (list){
    let x = Math.floor(Math.random() * list.length);
    let y = Math.floor(Math.random() * list.length);
    let b = list[y];
    list[y] = list[x];
    list[x] = b;
}

function mixPuz(){
    for (let i = 0; i < 10; i++) // сколько раз перемешать
    swap(arr);
    let pieces = $('.puzzle');
    let array=[];
        pieces.each(function(i){
        for (let j=0; j< arr.length;j++){
            if (j==i) {
                leftPos = arr[j][0];
                $(this).css({
                    position: 'absolute',
                    left: arr[j][0],
                    top: arr[j][1]
                });
            }
        }
    })
}


function cellsPuzzle(){    
    if (!$('.start').attr('disabled') && minStart == 1) timerBack();
    $('.start').attr('disabled', true);
    $('.check').attr('disabled', false);
    $('.new').attr('disabled', true);
        
}

    function draggabled(){
        $('.puzzle').draggable({
            revert: 'invalid',
            cursor: "move",
            grid: [75,75],
            start: function(){
                if($(this).hasClass('drop-piece')){
                    $(this).removeClass('drop-piece');
                    $(this).parent().removeClass('piece');
                }
            }
        });
    }


    function droppabled(){
        $('.drop').droppable({
            hoverClass: 'ui-state-highlight',
            accept: function(){
                return !$(this).hasClass('piece');
            },
            activate: function(event, ui){                
                cellsPuzzle();
            },            
            drop: function(event, ui)
                {   
                    let dropped = $(this);
                    let drag = ui.draggable;
                    dropped.addClass('piece');
                    $(drag).addClass('drop-piece').css({
                        left: 0,
                        top:0,
                        position: 'relative'
                }).appendTo(dropped);
                checkPuzzle();
            }
        })
    }

    function checkPuzzle(){
        check = getPuzzle();
        if((!check && secBack==0 && minStart == 0)){                            
            showModal();
            $('.modal-check').hide();
            $('.modal-time').hide();
            $('.check').attr('disabled', true);
            $('.new').attr('disabled', false);
        }
        check = true;
    }
    
    function getPuzzle (){
        let id =0;
        if($('#end .piece').length!==16) {            
            check = false;
        } else {
            check = true;
            for (let i =0; i<16; i++){
                id =$('.piece .puzzle').eq(i).attr('data-id');                   
                if (i!=id) {
                    check = false;               
                    break;
                } 
            }
        }
        if(check){
            $('.modal-text').text ('Woohoo, well done, you did it!');
        }
        else{
            $('.modal-text').text ('It`s a pity, but you lost');
        }
        return check;
    }

    function showModal(){
        $('.modal-check').show();
        $('.modal-container').css({
            backgroundColor:'#000000c7',
            zIndex: 3
        });
        $('.modal').css({
            top: (window.innerHeight - $('.modal').height())/2,
            left: (window.innerWidth - $('.modal').width())/2
        });
        $('.modal').show();
    };

    $('.start').on('click', function(){
        cellsPuzzle();   
    })

    $('.check').on('click', function(){
        showModal();
        $('.modal-check').show();
        $('.modal-time').show();
        $('.modal-text').text('You still have time, you sure?');
        $('.modal-check').on('click', function(){
            $('.modal-check').hide();
            $('.modal-time').hide();
            if ($('#end .piece').length < 16) {           
                $('.modal-text').text('It`s a pity, but you lost');
            } else {
                getPuzzle();
                if (check) {
                    $('.check').attr('disabled', true);
                    clearTimeout(timeBack);                
                    $('.new').attr('disabled', false);
                }
                if(secBack==0) {
                    $('.check').attr('disabled', true);
                    $('.new').attr('disabled', false);
                    $('.start').attr('disabled', false);
                }
            }
        })
    })


    function createDrag(){
        let kol = column*row;
        $('#start').empty();
        $('#end div').remove('.puzzle');
        if($('#end .drop').hasClass('piece')){
            $('#end .drop').removeClass('piece');
        }
        for (let i = 0; i< kol; i++){
            k = parseInt(i%column);
            j = parseInt(i/row);       
            block.append($('<div class="puzzle"></div>')); 
            $('.puzzle').eq(i).css('backgroundPosition', (300 - k * 75) + 'px ' + (300- j * 75) + 'px');        
            $('.puzzle').eq(i).attr('data-id',i);
        }    
        draggabled();
    } 

    $('.close').on('click', function(){
        $('.modal').hide();
        $('.modal-container').css({
            backgroundColor:'#FFF',
            zIndex: -1
        });
        if(secBack == 0) {
            $('.new').attr('disabled', false);
            $('.check').attr('disabled', true);
            $('.start').attr('disabled', true);
        }
    })

    $('.new').on('click', function(){
        createDrag();
        mixPuz();
        mixPuz();
        mixPuz();
        $('.new').attr('disabled', true);
        $('.start').attr('disabled', false);
        secBack=0;
        minStart = 1;
        $('.times').text(`00:00`);
        clearTimeout(timeBack);
    })

    function tickBack(){        
        if (secBack > 0) secBack--;
            if (secBack <= 0) {
                if (minStart > 0) secBack = 59;            
                if (minStart > 0) minStart--;
            }
    }
    
    function subtract(){
        tickBack();    
        minSt = minStart;
        if (minSt < 0) minSt = 0;
        if (secBack < 10 && secBack >= 0)  {
            secBk = '0' + secBack;
        } else {
            secBk = secBack;
        }
        if (minSt< 10 && minSt >= 0) {
            minSt = '0' + minSt;
        } else { 
            minSt = minSt;
        };
        $('.times').text(`${minSt}:${secBk}`);
        $('.modal-time').text( `${minSt}:${secBk}`);        
        timerBack();   
        if(minSt==0 && secBk==0){
            check = true;
            MinSt = 1; 
            showModal();
            clearTimeout(timeBack);
            $('.modal-check').hide();
        }             
    }
    
    function timerBack() {
        timeBack = setTimeout(subtract, 1000);
    }

})



