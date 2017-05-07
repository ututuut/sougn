;(function ($ , window , document , undefined){
    var Select = function (ele , opt){
            this.$ele = ele,
            this.default = {
                default:"下拉框",//默认文字
                selectClass:"border-bottom-1-grayc font-line-normal font-normal border-bottom-2-light head",//点击菜单的样式
                ulClass:"border-bottom-2-light",//下拉菜单包裹的样式
                liClass:"font-normal font-line-normal head",//下拉菜单的样式
                isOpen:"false",//下拉框是否打开
                liStr:"<li data-value=\"{0}\" data-str=\"{1}\"><div class=\"{2}\">{3}</div></li>",
                needInput:"true",//不去要搜索框
                movseOver:"red"
            },
            this.options = $.extend({} , this.default , opt);
    }

    Select.prototype = {
        _init:function (){//初始化插件
           // console.log(this.$ele.html());
            var opt = this.options;
            var Str = "<div class=\"select\">"+
            "<div class=\"select-head {0}\">"+
                "<span class=\"checked\">{1}</span>"+
                "</div>"+
                "<div style=\"display:{2}\">"+
                "<input type=\"text\" placeholder=\"搜索\" class=\"border-bottom-2-light font-line-normal \" style='display: {3}'>"+
                "<div >"+
                "<ul class=\"{4}\" >{5}"+
                "</ul>"+
                "</div>"+
                "</div>"+
                "</div>";

            var Add = opt.liStr;
            this.$ele.each(function (index){//隐藏所有select
                var $select = $(this);
                var selectList = $select.find("option");
                var selectSize = selectList.length;
                var allStr = "";
                var addNew = "";
                for(var i = 0 ; i < selectSize  ; i++)
                {
                    addNew = Add;
                    allStr += addNew.addStr($(selectList[i]).attr("value"),$(selectList[i]).html() ,opt.liClass  , $(selectList[i]).html());
                }
                addNew = Str;
                addNew = addNew.addStr(opt.selectClass , opt.default,opt.isOpen == "false"?"none":"block" , opt.needInput == "false"?"none":"block" ,opt.ulClass , allStr );
                //console.log($select.attr());
                $(addNew).insertAfter($select);//添加节点在每个select后面
                $select.attr({"data-id":index})
                $select.css({"display":"none"});
            });//隐藏插件
            //console.log($(this));
            //为每个节点都添加事件绑定

        },
        _close:function (e , $ul){//关闭下拉框
            $ul.attr({"data-type":"close"});
            $ul.css({"display":"none"});
            return false;
        },
        _open:function (e , $ul){//开启下拉框

            $ul.attr({"data-type":"open"});
            $ul.css({"display":"block"});
            var $li = $($ul).find("li")[0];
            this._keyDown($li);//打开之后添加键盘监听，对当前的下拉框进行监听
            return false;
        },
        _select:function (e , input , $ul){//查询下拉框
            var str = $(input).val();
            var opt = this.options;//配置参数
            var Add = this.options.liStr;//下拉框基础字符串
            var options = $ul.parent().prev().find("option");//获取当前下拉框的所有选项
            var optionsLength = options.length;//获取长度
            var allStr = "";//字符串汇总
            if(str.length == 0)//没有输入的时候显示全部
            {
                for(var i = 0 ; i < optionsLength ; i++){
                    addNew = Add;
                    allStr += addNew.addStr($(options[i]).attr("value"),$(options[i]).html(), opt.liClass  , $(options[i]).html());
                }
                //往ul中添加字符串

            }else//显示查找的内容
            {
                var b = [];
                for(var i = 0 ; i < optionsLength ; i++)//将当前的所有选项存入数组中，为搜索准备
                {
                    b[i] = [];
                    var a = [$(options[i]).attr("value"),$(options[i]).html(),$(options[i]).html()];
                    b[i] = a;
                }

                var regExp = new RegExp(str,"g");
                for(var i = 0 ; i < optionsLength ; i++)
                {
                    var a = [];
                    a = b[i];
                    if(regExp.test(a[2]))//如果正确匹配上了
                    {
                        a[2]=a[2].replace(regExp, "<span style=\"color:red\">"+str+"</span>");
                    }else//没有匹配上，删除当前数组
                    {
                        b.splice(i,1);
                        optionsLength--;
                        i--;
                    }
                }

                //重新开始构造下拉框
                optionsLength = b.length;
                for(var i = 0 ; i < optionsLength ; i++)
                {
                    addNew = Add;
                    allStr += addNew.addStr(b[i][0] , b[i][1] , this.options.liClass  , b[i][2]);
                }
            }
            //往ul中添加字符串
            $ul.find("ul").html(allStr);
        },
        _check:function (obj){//选中
            var dataValue = obj.attr("data-value");
            var value = obj.attr("data-str");
            var selectParent = obj.parent().parent().parent().parent();

            selectParent.find(".checked").attr({"data-value":dataValue}).html(value);

            selectParent.prev().val(dataValue);
        },
        _mouseOver:function (obj){//鼠标移入事件
            var opt = this.options;//配置参数
            //先清空所有样式
             obj.parent().each(function (){
                $(this).remove(opt.movseOver);
             });
            obj.addClass(opt.movseOver);
        },
        _mouseOut:function (obj) {//鼠标移除事件
            var opt = this.options;//配置参数
            obj.removeClass(opt.movseOver);
        },
        _keyDown:function (obj){//键盘点击监听事件
            var opt = this.options;
            obj = $(obj);
            var $select = this;
            $(window).keydown(function (event , opt){
                switch(event.keyCode){
                    case 38://向上键
                        //存在前面一个
                        if(obj.prev().length != 0)
                        {
                            //向上先把下面的一个的效果移除
                            if(obj != undefined)
                            {
                                $select._mouseOut(obj);
                            }
                            console.log(obj);
                            $select._mouseOver(obj.prev());
                            obj = obj.prev();
                        }else//没有前面一个了，什么都不做
                        {

                        }
                        $select._check(obj);
                        break;
                    case 40://向下键

                        //存在下面一个
                        if(obj.next().length != 0)
                        {
                            //为上一个移除效果
                            if(obj != undefined)
                            {
                                $select._mouseOut(obj);
                            }
                            $select._mouseOver(obj.next());
                            obj = obj.next();
                        }else//没有下面一个了
                        {

                        }
                        $select._check(obj);
                        break;
                    case 13://回车
                        $select._close(event , obj.parent().parent().parent());
                        break;
                    default:
                        break;
                }
            });
        },
        _bind:function (){//绑定事件
            var $select = this;
            this.$ele.each(function (){

                $(this).next().on("click","li",function (){//选中某个选项

                    $select._check($(this));

                });
                $(this).next().on("mouseover","li",function (){//鼠标移动上去

                    $select._mouseOver($(this));

                });

                $(this).next().on("mouseout","li",function (){//鼠标移除

                    $select._mouseOut($(this));

                });



                $(this).next().find("input").on("click",function (e){//监听点击事件，阻止事件传递
                    e.stopPropagation();
                });

                $(this).next().find("input").on("input propertychange",function (e){//监听输入框变化事件
                    var $ul = $(this).next().find("ul").parent().parent();
                    $select._select( e , this , $ul);
                    var $li = $($ul).find("li")[0];
                    $select._keyDown($li);//打开之后添加键盘监听，对当前的下拉框进行监听
                });

                $(this).next().on("click",".select-head",function (e){
                    //根据css属性判断是否打开
                    var $ul = $(this).next().find("ul").parent().parent();
                    var css = $ul.css("display");
                    if(css == "block")//已经显示了，关闭窗口
                    {
                        $select._close(e , $ul);
                    }else// 显示窗口
                    {
                        $select._open(e ,$ul);
                        $ul.attr({"isFrist":"true"});
                        $(document).off("click").on("click",function (){
                            if($ul.attr("isFrist") == "false")
                            {
                                $select._close(e , $ul);
                                $ul.attr({"isFrist":"true"});
                            }
                            $ul.attr({"isFrist":"false"});
                            e.stopPropagation();
                        });
                    }
                });
            });
        }
    }

    $.fn.select = function(options){
        var selectObj = new Select(this , options);

        selectObj._init();//初始化页面上所有的下拉框
        selectObj._bind();//绑定事件

    }

})(jQuery , window , document);