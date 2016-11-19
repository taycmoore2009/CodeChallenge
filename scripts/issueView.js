(function(){
    var IssueView = Backbone.View.extend({
        events: {
            "click [data-link]": "openLink"
        },

        openLink: function(e){
            window.open($(e.currentTarget).data("link"), "_blank");
        },

        /* render issue on the screen */
        render: function(){

            /* get issue list from github with params */
            $.get("https://api.github.com/repos/rails/rails/issues/"+ this.model.get("issueNum")).then(function(issue){

                /* render HTML */
                /* -- Needs to be changed to use _.templates -- */
                $("h1").html("Issue: #"+ issue.number +"<br/><span>"+ issue.title +"</span>");
                this.$el.html(function(){
                    /* create html */
                    var html = "";
                    
                    html += "<div class='issueItem'>"+
                                "<div class='issueItemUser' data-link='"+ issue.user.html_url +"'><img src='"+ issue.user.avatar_url +"' /><span>@"+ issue.user.login +"</span></div>"+
                                "<div class='issueItemContent'>"+
                                    "<div class='issueItemLabels'>";
                    if(issue.labels.length > 0){
                        $(issue.labels).each(function(){
                            html += "<span style='background-color: #"+ this.color +"'>"+ this.name +"</span>";
                        });
                    } else {
                        html += "<span class='noLabels'>No Labels</span>";
                    }
                    html +=         "</div>"+    
                                    "<div class='issueItemDesc'>"+ issue.body +"</div>"+
                                "</div>"+
                            "</div>"+
                            "<div class='comments'></div>";
                    return html;
                });
                if(issue.comments > 0){
                    this.getComments(issue.comments_url);
                }
            }.bind(this));
        },

        /* get comments and add them to end of page */
        getComments: function(comments_url){
            $.get(comments_url).then(function(comments){
                this.$el.find(".comments").html(function(){
                    var html = "";
                    $(comments).each(function(){
                        html += "<div class='comment'>" +
                                    "<div class='commentUser' data-link='"+ this.user.html_url +"'>"+
                                        "<img src='"+ this.user.avatar_url +"' />"+
                                        "<span>@"+ this.user.login +"</span>"+
                                    "</div>"+ 
                                    "<div class='commentBody'>"+
                                        "<div class='commentBodyHeader'>"+
                                            "<span>Comment #"+ this.id +" </span>"+
                                            "<span>Created "+ this.created_at +" | </span>"+
                                            "<span>Updated "+ this.updated_at +"</span>"+
                                        "</div>"+
                                        "<div class='commentBodyContent'>"+ this.body +"</div>"+
                                    "</div>"+
                                "</div>"
                    });
                    return html;
                });
            }.bind(this));
        }
    });
    $(document).ready(function(){

        /* create backbone model and view */
        var model = Backbone.Model.extend(),
            issueView = new IssueView({
                el: $(".issueView"),
                model: new model({issueNum: window.location.search.split("=")[1]})
            });
        
        /* First render on the page load */
        issueView.render();

    });
})();