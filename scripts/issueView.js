(function(){
    var IssueView = Backbone.View.extend({
        events: {
        },

        /* render issue on the screen */
        render: function(){

            /* get issue list from github with params */
            $.get("https://api.github.com/repos/rails/rails/issues/"+ this.model.get("issueNum")).then(function(issue){

                /* render HTML */
                /* -- Needs to be changed to use _.templates -- */
                this.$el.html(function(){
                    /* create html */
                    var html = "";
                    html += "<div class='issueItem' data-link='"+ issue.number +"'>"+
                                "<div class='issueItemUser'><img src='"+ issue.user.avatar_url +"' /><span>"+ issue.user.login +"</span></div>"+
                                "<div class='issueItemContent'>"+
                                    "<div class='issueItemTitle'>"+ issue.title +"<span>#"+ issue.number +"</span></div>"+
                                    "<div class='issueItemLabels'>";
                    if(issue.labels.length > 0){
                        $(issue.labels).each(function(){
                            html += "<span style='background-color: #"+ issue.color +"'>"+ issue.name +"</span>";
                        });
                    } else {
                        html += "<span class='noLabels'>No Labels</span>";
                    }
                    html +=         "</div>"+    
                                    "<div class='issueItemShortDesc'>"+ issue.body +"</div>"+
                                    "<div class='comments'></div>"
                                "</div>"+
                            "</div>";
                    return html;
                });
                if(issue.comments > 0){
                    this.getComments(issues.comments_url);
                }
            }.bind(this));
        },

        /* get comments and add them to end of page */
        getComments: function(comments_url){
            $.get(comments_url).then(function(comments){
                this.$el.find(".comments").html(function(){
                    var html = "";
                    $(comments).each(function(comment){
                        /*---- Add comment stuff here ----*/
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