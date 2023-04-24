// ==UserScript==
// @name           Kickstarter auto-hide completed backings
// @namespace      https://github.com/ksuquix/kickstarter-tamper
// @version        0.0.6
// @description    An assist so you can see the projects you haven't gotten yet.
// @include        https://www.kickstarter.com/profile/backings?ref=user_menu
// @require        http://code.jquery.com/jquery-1.10.2.min.js
// @run-at         document-end
// ==/UserScript==

function closemodals() {
	// to make sure
	console.log("close modals");
	for(let i=0;i<=$('.modal_dialog_close').length;i++) {
		if($('.modal_dialog_close').filter(':visible').length>0) {
			$('.modal_dialog_close').filter(':visible')[0].click();
		}
	}
}

var loadnotescounter = 0;
function loadnotesloop() {
    setTimeout(function() {
		loadnotescounter++;
		if($('.modal_dialog_close').filter(':visible').length>0) {
			$('.modal_dialog_close').filter(':visible')[0].click();
		}
		console.log("timing loadnotesloop");
		let a = $(".backing-plus-btn:visible:not(.notespulled)");
		a.slice(0,1).each(function(b) {
			console.log("clicking: "+$(this).parents("tr").attr("id"));
			$(this)[0].click();
			$(this).addClass("notespulled");
		});
		$(".backings-info__notes:has(p):not(.notesshown)").each(function(j){
			console.log("showing: "+$(this).parents("div[data-backing_id]").attr("data-backing_id"));
			$("tr#backing_"+$(this).parents("div[data-backing_id]").attr("data-backing_id")).children().eq(6).append($(this).contents().filter("p").html());
			$(this).addClass("notesshown");
		});
		// I have a ton of pledges... this number might change for people cloning this.
		if(loadnotescounter<130) {
			loadnotesloop();
		} else {
			setTimeout(closemodals(),1000);
		}
    }, 1000);
}

$(document).ready(function() {
    var observer = new MutationObserver(function( mutations ) {
		mutations.forEach(function( mutation ) {
			console.log(mutation);
			var newNodes = mutation.addedNodes; // DOM NodeList
			if( newNodes !== null ) { // If there are new nodes added
				console.log("new nodes");
				$("input:checked").closest("tr").hide();
				$(":checkbox[id^=backer_completed_at][value=true]").closest("tr").hide();
				$('button[data-sentiment="negative"][data-selected="true"]').closest('tr').hide();
				$('#uncollected').hide();
				//console.log($("#collected a.show_more_backings"));
				if($("#collected a.show_more_backings").hasClass("loading")) {
					console.log("still loading");
					return;
				}
				if($("#collected a.show_more_backings").is(":hidden")) {
					//console.log("show more hidden now");
					if(loadnotescounter<1) {
					console.log("triggering loadnotesloop");
					loadnotescounter++;
					loadnotesloop();
					}
					return;
				}				  
				$("#collected a.show_more_backings")[0].click();
			}
			$('.modal_dialog_close').filter(':visible').click();
		});    
    });
    var config = { 
	attributes: true, 
	childList: true, 
	characterData: true 
    };
    observer.observe($("#collected table")[0], config);
    // observer.disconnect();
    $("#collected a.show_more_backings")[0].click();

    $(".backings-info__notes:not(:has(p))").each(function(j) { $("tr#backing_"+$(this).parents("div[data-backing_id]").attr("data-backing_id")).find(".backing-plus-btn:visible").removeClass("notespulled"); $(this).removeClass("notesshown"); });
});
