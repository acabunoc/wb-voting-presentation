
var WB_votes = (function(){
  var DB = "http://localhost:9002", //"http://abby.wormbase.org",
      Q_DEFAULT = ["Searching",
                   "Page features",
                   "My WormBase"],
      Q_DEFAULT_SLIDE = [7, 9, 11, 13],
      Q_END = [ "Saving/analyzing lists of genes",
                "Community annotations",
                "Faster",
                "WormBase app",
                "Less bugs"],
      VOTING_ON,
      turn_off=false;
  
  function voting_options(data){
    $.ajax({ type: "POST", url: DB + "/voting_options", data: JSON.stringify(data) });
  }
  
  function update_votes(){
    $.ajax({ type: "GET", url: DB + "/votes", dataType: "json", 
      success: function(data){
        var votes = data,
            values = $(".present ol li");
        for(i=0, len=votes.length; i<len; i++){
          values.children(".opt" + i).css('width', (votes[i] * 20) + 'px');
        }
      }
    });
  }
  
  function voting_off(){
    if(VOTING_ON){
      voting_options(["no voting right now"]);
      window.clearInterval(VOTING_ON)
    }
  }
  
  function voting_on(opts){
    if(!opts || opts == "end") {
      if(opts) get_option();
      opts ? add_values(Q_END) : add_values(Q_DEFAULT, 1);
      opts = opts ? Q_END : Q_DEFAULT;
    }
    voting_options(opts);
    VOTING_ON = setInterval(update_votes, 800); 
  }
  
  function get_option(){
    $.ajax({
      type: "GET",
      url: DB + "/option",
      success: function(data){
        add_values(data);
        update_votes();
        get_option();
      }
    });
  }
  
  function add_values(values, links){
    var ol = $(".present ol").empty(),
        addition = "";
    for(i=0, len=values.length; o=values[i++];){
      addition += "<li" + (links ? " onClick=\"WB_votes.remove(" + (i-1) + ");\"" : "" ) + ">" + o + "<span class=\"bar opt" + (i-1) + "\"></span></li>";
    }
    ol.append($(addition));
  }
  
  function remove(index) {
    window.location.hash = "/" + ((index > -1) ? Q_DEFAULT_SLIDE[index] : Q_DEFAULT_SLIDE.pop());
    if(index > -1)
      Q_DEFAULT.splice(index, 1);
    Q_DEFAULT_SLIDE.splice(index, 1);
    voting_off();
  }
  
  return {
    voting_on: voting_on,
    voting_off: voting_off,
    remove: remove
  }

})();