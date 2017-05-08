/**
 * Created by ututuut on 2017/5/5.
 */

;(function ($ , window , document , undefined){
    var Pop = function (ele  ,opt){
        this.default = {

        };
        this.$ele = ele;
        this.options = $.extend({},this.default ,opt);
    }
    Pop.prototype = {
        _close:function ($pop){
            $pop.addClass("pop-out");
            $pop.removeClass("pop-in");

            setTimeout(function (){
                $pop.fadeOut();
            },300);



        },
        _open:function ($this){

            var id = $this.attr("data-pop-id");

            var $pop = $("#"+id);

            console.log(id);

            $pop.css({"display":"table","position":"fixed","visibility":"visible"}).removeClass("pop-out").addClass("pop-in");

        },
        _bind:function ($this){
            var id = $this.attr("data-pop-id");
            var $pop = $("#"+id);
            var $plugin = this;
            $pop.find(".close").on("click",function (){//关闭窗口
                $plugin._close($pop);
            });

            $this.on("click",function (){//打开窗口
                $plugin._open($this)
            });
        }
    }
    $.fn.pop = function (options) {
        var popObj = new Pop(this , options);
        popObj._bind(this);//绑定事件
    }
})(jQuery , window , document);