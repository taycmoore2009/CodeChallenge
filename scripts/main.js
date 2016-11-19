(function(){
    var GitHubMainView = Backbone.View.extend({
        render: function(){

            /* get issue list from github with params */
            $.get("https://api.github.com/repos/rails/rails/issues?per_page="+ this.model.get("pageSize") +"&page="+ this.model.get("page")).then(function(list){

                /* render HTML */
                /* -- Needs to be changed to use _.templates -- */
                this.$el.html(function(){
                    /* create html */
                    var html = "";
                    $(list).each(function(){
                        var desc = this.body.substr(0, 140);
                        html += "<div class='issueItem' data-link='viewIssue?issue="+ this.number +"'>"+
                                    "<div class='issueItemUser'><img src='"+ this.user.avatar_url +"' /><span>"+ this.user.login +"</span></div>"+
                                    "<div class='issueItemContent'>"+
                                        "<div class='issueItemTitle'>"+ this.title +"<span>#"+ this.number +"</span></div>"+
                                        "<div class='issueItemLabels'>";
                        if(this.labels.length > 0){
                            $(this.labels).each(function(){
                                html += "<span style='background-color: #"+ this.color +"'>"+ this.name +"</span>";
                            });
                        } else {
                            html += "<span class='noLabels'>No Labels</span>";
                        }
                        html +=         "</div>"+    
                                        "<div class='issueItemShortDesc'>"+ desc.substr(0, Math.min(desc.length, desc.lastIndexOf(" "))) +"</div>"+
                                    "</div>"+
                                "</div>";
                    });
                    return html;
                })
            }.bind(this));
        },
    });
    $(document).ready(function(){

        /* create backbone model and view */
        var model = Backbone.Model.extend(),
            gitHubMainView = new GitHubMainView({
                el: $(".githubList"),
                model: new model({pageSize: 25, page: 1})
            });
        
        /* First render on the page load */
        gitHubMainView.render();

    });
})();