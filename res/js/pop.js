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
        _close:function (){

        },
        _open:function (){
            var eleTop = this.$ele.offset().top;
            var scrollTop = $(document).scrollTop();

            var eleToWindowTop = eleTop - scrollTop;

            var left = this.$ele.offset().left;

            var str = this.options.round.addStr(this.options.round.width);

            $(str).insertAfter("body");

            $("#thisisforpop").css({"position": "fixed","top":eleToWindowTop,"left":left});

        },
        _bind:function (){

        }
    }
    $.fn.pop = function (options) {
        var popObj = new Pop(this , options);

        popObj._open();//打开窗口
        popObj._close();//关闭窗口
    }
})(jQuery , window , document);