/* Author: Buzz Swarbrick */
(function($){
    var BUZZ = {
        ascii: {

            init: function() {
                var self = this;
                $(function(){
                    self.stage.init();
					self.toolbar.init();
                });
            },
			
			utils : {
				setCharAt :	function (str,index,chr) {
					if(index > str.length-1) return str;
					return str.substr(0,index) + chr + str.substr(index+1);
				}
			},

            stage: {
				defaults: {
					$stage:$('#main pre'),
					$debug:$('.debug'),
					xRatio: (50/391), 
					yRatio: (25/315),
					char: "o",
					saveMemory: [,,,,],
					saveIndex: -1,
					debug: false
					
				},
                init: function() {
                    var self = this,
					characterWidth = 100,
					characterHeight = 25,
					stageString = "",
					border = ""
				
					
					for(var i=0;i<characterHeight;i++){	
						stageString += "<div class='row'>";
						for(var j=0;j<characterWidth;j++){
							stageString += " ";
						}
						stageString += "</div>";
					}
					
					border += "<div class='row'>|";
					for(var j=0;j<characterWidth;j++){
						border += "-";
					}
					border += "|</div>";
						
					self.defaults.$stage.html(stageString);  
					
					
					if(self.defaults.debug){
						self.defaults.$debug.show()
					}else{
						self.defaults.$debug.hide()
					}
					
					$(function(){
						self.tools();
					});
					self.saveState();
                },
				tools: function(){
					var self = this,
					$stage = self.defaults.$stage,
					$debug = self.defaults.$debug,
					xRatio = self.defaults.xRatio,
					yRatio = self.defaults.yRatio,
					draw = false
					
				
					
					$stage.mousemove(function(e){
						var offset = $(this).offset(),
					    colNum =  Math.round((e.clientX - offset.left)*xRatio),
					  	rowNum =  Math.round((e.clientY - offset.top)*yRatio),
						$row = $("div:nth-child("+rowNum+")",$stage),
						rowText = $row.text();
						
						if(self.draw){
						rowText =  BUZZ.ascii.utils.setCharAt(rowText,colNum,self.defaults.char)
						$row.html(rowText);
						}
					
						
						$debug.html("").html("colNum : "+colNum+ " <br />rowNum : "+rowNum)
						
						
					})
					$stage.mousedown(function(){
						self.draw = true
						
					})
					$stage.mouseup(function(){
						self.draw = false
						self.saveState()
					})	
					
					
				},
				saveState : function(){
					var self = this,
					stateArray = []
					
					
					//convert stage into array
					$(".row",self.defaults.$stage).each(function(){
						
						var tmpRow = $(this).text().split()
						stateArray.push(tmpRow)
					})
					self.defaults.saveIndex++;
					self.defaults.saveMemory[self.defaults.saveIndex] = stateArray
					
					
					
				},
				writeState : function(){
			
					var self = this,
					prevIndex = (self.defaults.saveIndex-1<0) ? 0 : self.defaults.saveIndex-1
					
					saveArray = self.defaults.saveMemory[prevIndex]
					
												
					$(".row",self.defaults.$stage).each(function(e){
						$(this).html('').html(saveArray[e].toString())
				
					})
			
					 self.defaults.saveIndex = prevIndex
				}
				
				
            },

			toolbar : {
				init : function(){
					var self = this
					self.undo()
				},
				undo :function(){
					$undo = $("#undo")
					$undo.click(function(e){
						
						BUZZ.ascii.stage.writeState();
						
						e.preventDefault()
					})
				}
			}
			



            


        }
    };

    if (typeof window.BUZZ === 'undefined' || typeof window.BUZZ.ascii === 'undefined') {
        window.BUZZ = BUZZ;

        BUZZ.ascii.init();
    }
})(jQuery);
