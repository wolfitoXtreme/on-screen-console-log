/**@license Copyright (c) 2015 Cesar Candela
* www.cssguy4hire.com 
*/

var debug = true,
    debugOnScreen = true,
    screenLog = '',
    logParent = 'body'
;


$(document).ready(function(){
    
    ///////////////////////////////////////////////////
    // ON SCREEN CONSOLE LOG                       
    ///////////////////////////////////////////////////

    if (debug) {
        
        if(debugOnScreen) {

            var sourceConsole = console.log,
                logDuration = 350
            ;


            console_log = function(){

                // create logHolder if it doesn't exist
                if($('#logHolder').length === 0) {
                    $(logParent).append(logHolder = $('<div id="logHolder" class="hidden">)'));

                    // create tab and content
                    $(logHolder).append(
                        tab = $('<div class="tab" />)'),
                        logContent = $('<div class="content" />)')
                    );

                    //set tab behaviors
                    $(tab).on({
                        'click' : function(event) {
                            if(!$(this).hasClass('off')) {

                                // disable tab
                                $(this).addClass('off');

                                // control logHolder
                                $(logHolder)
                                    .css({
                                        'transition-duration' :  logDuration + 'ms'
                                    })
                                    .on({
                                        'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd' : function(event){
                                            $(tab).removeClass('off'); 
                                        }
                                    })
                                    .toggleClass('hidden')
                                ;
                            }
                        }
                    })
                }

                var lh_height = $(logParent).outerHeight();

                $(logContent).height(lh_height);

                // compose screenLog
                for(var i=0; i < arguments.length; i++) {
                    screenLog += arguments[i] + '\n--\n';
                }

                // set logs to logContent
                $(logContent).text(screenLog);

                var lh_sHeight = $(logContent).prop('scrollHeight');

                // track scrolling
                if(lh_sHeight > lh_height) {
                    $(logContent).scrollTop(lh_sHeight - lh_height);
                }

                if(lh_sHeight > lh_height * 3) {
                    screenLog = '';
                }

                // apply logs to console sourceConsole
                // sourceConsole.apply(console, arguments);

            }

        }
        else {
            var console_log = console.log.bind(window.console);
        }


    }
    else {
        console_log = function(){}
    }

    // initialize console
    console_log();

    ///////////////////////////////////////////////////
    // DOT ANIMATION                  
    ///////////////////////////////////////////////////

    var dotSize = 40,
        dotSpeed = 0.45,
        dotTime,
        dotClass ='dot',
        dotOpacity = 0.55,
        container = $('#drawArea'),
        axis,
        axisCounter = 1,
        axisValueCounter = 1,
        started = false,
        availableWidth,
        availableHeight,
        actionButton = $('#createDotsBtt')
    ;

    function getAxisValue(axisCounter, axisValueCounter) {

        if(axisValueCounter === 1) {
            var left = axis[axisCounter][1];
            var top = Math.floor(Math.random() * (axis[axisCounter][0] - (dotSize / 2))) + (dotSize / 2);
        }
        else {
            var left = Math.floor(Math.random() * (axis[axisCounter][0] - (dotSize / 2))) + (dotSize / 2);
            var top = axis[axisCounter][1];
        }

        return [left, top];
    }

    function setAxis() {

        availableWidth = $(container).outerWidth() - (dotSize / 2);
        availableHeight = $(container).outerHeight() - (dotSize / 2);

        axis = [
            [availableWidth , (dotSize / 2)],// top
            [availableHeight, availableWidth],// right
            [availableWidth, availableHeight],// bottom
            [availableHeight, (dotSize / 2)]// left
        ]
    }

    function createDot() {

        var size = dotSize,
            margin = size / 2,
            currentOpacity = dotOpacity,
            bgColor = '#' + Math.floor(Math.random()*16777215).toString(16)
        ;

        //create dummy origin
        $(container).append(dummyOrigin = $('<div class="dummyOrigin" />'));

        $(dummyOrigin).css({
            'left' : getAxisValue(axisCounter, axisValueCounter)[0] + 'px',
            'top' : getAxisValue(axisCounter, axisValueCounter)[1] + 'px',
            'width' : dotSize + 'px',
            'height' : dotSize + 'px'
        });


        var dot = $('<div class="' + dotClass +'" />'),
            destX = $(dummyOrigin).position().left,
            destY = $(dummyOrigin).position().top
        ;

    
        $(container).append(dot);
        $(dot)
            .data({
                'initX' : availableWidth / 2,
                'initY' : availableHeight / 2,
                'destX' : destX,
                'destY' : destY,
                'size' : size
            })
            .attr('id', 'dot').css({
                'margin-left' : -margin + 'px',
                'margin-top' : -margin + 'px',
                'padding-bottom' : size + 'px',
                'left' : $(dot).data('initX')+ 'px',
                'top' : $(dot).data('initY')+ 'px',
                'width' : size + 'px',
                'background-color' : bgColor,
                'opacity' : 1
            })
        ;


        // wait till dot is ready to animate
        var intiAnimation = setTimeout(function() {

            animateDot(dot);

            clearTimeout(intiAnimation);   
            
        }, 50);


    }

    function getPosition(dotPos, destPos) {

        if(dotPos >  destPos) {

            relPos =  -(dotPos - destPos);

        }
        else if (dotPos <  destPos) {
            relPos = destPos - dotPos;
        }
        else {
            relPos = 0;
        }

        return relPos;
    }

    function animateDot(dot) {


        console_log(
            'ANIMATING DOT\n' +
            'dot ID = ' + $(dot).attr('id') + '\n' +
            'left = ' + $(dot).position().left + '\n' +
            'top = ' + $(dot).position().top + '\n' +
            'initX = ' + $(dot).data('initX') + '\n' +
            'initY = ' + $(dot).data('initY') + '\n' +
            'destX = ' + $(dot).data('destX') + '\n' +
            'destY = ' + $(dot).data('destY') + '\n' +
            'size = ' + $(dot).data('size') + '\n' +   
            'outerWidth = ' + $(dot).outerWidth() + '\n' +
            'outerHeight = ' + $(dot).outerHeight() + '\n' + 
            'transform = ' +  $(dot).css('transform')
        );
        

        
        var initX = $(dot).data('initX'),
            initY = $(dot).data('initY'),
            destX = $(dot).data('destX'),
            destY = $(dot).data('destY')
        ;


        var nextX = getPosition(
                initX, 
                destX
            ),
            nextY = getPosition(
                initY, 
                destY
            )
        ;
            
        
        var dotDistance = Math.sqrt((nextX * nextX) + (nextY * nextY)),
            dotTime  = (dotDistance / dotSpeed) + 'ms'
        ;

        // set and remove transition event
        setTransition(dot, dotTime);
        

        console_log(
            'DESTINATION\n' +
            'initX = ' + initX + '\n' +
            'destX = ' + destX + '\n' +
            'nextX = ' + nextX + '\n' +
            'nextY = ' + nextY
        );



        // change position
        $(dot).css({
            'transform' : 'translateX('+ nextX +'px) translateY(' + nextY + 'px)'
        });

    }

    function setTransition(dot, duration){


        $(dot)
            .css({
                'transition-duration' :  duration
            })
            .one({

                'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd' : function(event){

                    axisCounter = axisCounter < axis.length - 1 ? axisCounter + 1 : 0;
                    axisValueCounter = axisValueCounter < 1 ? axisValueCounter + 1 : 0;

                    $(dummyOrigin).css({
                        'left' : getAxisValue(axisCounter, axisValueCounter)[0] + 'px',
                        'top' : getAxisValue(axisCounter, axisValueCounter)[1] + 'px'
                    });


                   $(this)
                        .css({
                            'left' : $(this).position().left + 'px',
                            'top' : $(this).position().top + 'px',
                            'transition-duration' :  '0ms',
                            'transform' : 'translateX(0px) translateY(0px)'
                        })
                        .data({
                            'initX' : $(this).position().left,
                            'initY' : $(this).position().top,
                            'destX' : $(dummyOrigin).position().left,
                            'destY' : $(dummyOrigin).position().top
                        })
                    ;
          
                    animateDot($(this));


                    console_log('DOT FINISHED ANINMATING');

                    // // button appearance
                    // var currentText = $(actionButton).attr('data-text')
                    //     prevtext = $('span', actionButton).text()
                    // ;


                    // if(animated === activedots.length) {
                        
                    //     animating = false;

                    //     $('span', actionButton).text(currentText);
                    //     $(actionButton).removeClass('unactive').attr('data-text', prevtext);

                    
                    // } else if (animated === 0) {
                        
                    //     animating = false;

                    //     for(var i=0; i<activedots.length; i++) {
                    //         $(activedots[i]).remove();
                    //     }

                    //     // reset all
                    //     dots = [];
                    //     activedots = undefined;

                    //     $(dummyOrigin).remove();

                    //     $('span', actionButton).text(currentText);
                    //     $(actionButton).removeClass('unactive').attr('data-text', prevtext);
                    // }
                    

                }
            })
        ;

    }


    // button
    var removeText = $(actionButton).attr('data-text')
        addText = $('span', actionButton).text()
    ;

    $(actionButton).on({
        'click' : function(event) {
            event.preventDefault();

            // create dot
            if(started === false) {

                amount = 1;
                started = true;
                setAxis();  
                createDot();

                $('span', this).text(removeText);

                return;

            }
            
            // remove dot
            if (started !== false){

                $('span', this).text(addText);

                // remove dot and dummy
                $(dummyOrigin).add(dot).remove();

                started = false;

                console_log('DOT REMOVED');

                return;

            }
        }
    });

    // window events
    var throttleSpeed = 50;

    $(window).on({

        'resize' : 

            $.throttle(throttleSpeed, function (event) {  
                setAxis();
            })

        
    });



});




    







 


