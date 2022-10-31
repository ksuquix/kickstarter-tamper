// ==UserScript==
// @name           Kickstarter auto-hide completed backings
// @namespace      https://github.com/ksuquix/kickstarter-tamper
// @version        0.0.2
// @description    An assist so you can see the projects you haven't gotten yet.
// @include        https://www.kickstarter.com/profile/backings?ref=user_menu
// @require        http://code.jquery.com/jquery-1.10.2.min.js
// @run-at         document-end
// ==/UserScript==

function loadnotesloop() {
    setTimeout(function() {
	a = $(".backing-plus-btn:visible:not(.notespulled)");
	a.slice(0,1).each(function(b) { $(this).click(); $(this).addClass("notespulled"); });
	$(".backings-info__notes:has(p):not(.notesshown)").each(function(j){ $("tr#backing_"+$(this).parents("div[data-backing_id]").attr("data-backing_id")).children().eq(6).append($(this).contents().filter("p").html()); $(this).addClass("notesshown"); });
	$(".modal_dialog_close:visible").click();
	loadnotescounter++;
	if(loadnotescounter<130) {
	    loadnotesloop();
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
		console.log($("#collected a.show_more_backings"));
		if($("#collected a.show_more_backings").hasClass("loading")) {
		    return;
		}
		if($("#collected a.show_more_backings").is(":hidden")) {
		    return;
		}
		$("#collected a.show_more_backings")[0].click();
	    }				  
	});    
    });
    var config = { 
	attributes: true, 
	childList: true, 
	characterData: true 
    };
    observer.observe($("#collected table tbody")[0], config);
    // observer.disconnect();
    $("#collected a.show_more_backings")[0].click();

    var loadnotescounter = 0;
    loadnotesloop();


    $(".backings-info__notes:not(:has(p))").each(function(j) { $("tr#backing_"+$(this).parents("div[data-backing_id]").attr("data-backing_id")).find(".backing-plus-btn:visible").removeClass("notespulled"); $(this).removeClass("notesshown"); });

});