(function(){
    var GitHubMainView = Backbone.View.extend({
        events: {
            "change .numOnPage": "changePageSize",
            "click .previousPage": "previousPage",
            "click .nextPage": "nextPage",
            "click [data-link]": "openLink"
        },

        /* change the number of items on the screen */
        changePageSize: function(e){
            this.model.set("pageSize", $(e.currentTarget).val());
            this.render();
        },

        /* go to previous page */
        previousPage: function(e){
            var page = this.model.get("page") - 1;
            if(page > 0){
                this.model.set("page", page)
                if(page <= 1){
                    $(e.currentTarget).attr("disabled", true);
                }
                $(".nextPage").removeAttr("disabled");
                this.render();
            } else {
                $(e.currentTarget).attr("disabled", true);
            }
        },

        /* go to next page */
        nextPage: function(e){
            var page = this.model.get("page");
            
            this.model.set("page", page + 1)
            $(".previousPage").removeAttr("disabled");
            this.render();
        
        },

        /* load page to issue selected */
        openLink: function(e){
            window.open($(e.currentTarget).data("link"));
        },

        /* render new items on the screen */
        render: function(){

            /* get issue list from github with params */
            $.get("https://api.github.com/repos/rails/rails/issues?per_page="+ this.model.get("pageSize") +"&page="+ this.model.get("page")).then(function(list){

                /* render HTML */
                /* -- Needs to be changed to use _.templates -- */
                this.$el.find(".githubList").html(function(){
                    /* create html */
                    var html = "";
                    $(list).each(function(){
                        var desc = this.body.substr(0, 140);
                        html += "<div class='issueItem'>"+
                                    "<div class='issueItemUser' data-link='"+ this.user.html_url +"'><img src='"+ this.user.avatar_url +"' /><span>@"+ this.user.login +"</span></div>"+
                                    "<div class='issueItemContent' data-link='issueView.html?issue="+ this.number +"'>"+
                                        "<div class='issueItemTitle'>"+ this.title +"</div>"+ " <span>Issue #"+ this.number +"</span>"+
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
                });

                /* check if there is enough items for a next page */
                if(list.length < this.model.get("pageSize")){
                    $(".nextPage").attr("disabled", true);
                }
            }.bind(this));
        },
    });
    $(document).ready(function(){

        /* create backbone model and view */
        var model = Backbone.Model.extend(),
            gitHubMainView = new GitHubMainView({
                el: $("body"),
                model: new model({pageSize: 25, page: 1})
            });
        
        /* First render on the page load */
        gitHubMainView.render();

    });
})();