/* Client interface */
(function ($, window) {
    //------------------------ SCI -----------------------//
    var SCI = window.SCI;
    if (SCI == null) {
        SCI = function () {
            return "Lawyer Client Interface";
        };
    }
    //-- Utility method --//
    $.extend(SCI, {
        rewriteUrl: function (url, params, ignoreUrlPara) {
            var parser = document.createElement('a');
            parser.href = url;
            if (parser.search && !ignoreUrlPara) {
                var arr = parser.search.substr(1).split('&');
                for (var i = 0; i < arr.length; i++) {
                    var curp = arr[i].split('=');
                    if (curp.length == 2 && typeof (params[curp[0]]) == 'undefined') params[curp[0]] = curp[1];
                }
            }
            var query = '';
            for (var k in params) {
                query = query + (query.length > 1 ? '&' : '?') + k + "=" + params[k];
            }
            return parser.protocol + "//" + parser.host + parser.pathname + query + parser.hash;
        },
        getQueryPara: function (name) {
            var query = location.search;
            if (query.length > 1) {
                query = query.substr(1);
                var arr = query.split('&');
                for (var i = 0; i < arr.length; i++) {
                    var param = arr[i].split('=');
                    if (param.length == 2 && name.toLowerCase() == param[0].toLowerCase()) {
                        return param[1];
                    }
                }
            }
            return "";
        },

        alert: function (msg, type) {
            if (type == "undefined" || type == "" || type == null) type = "warning";
            if (window.swal) window.swal("", msg, type);
            else alert(msg);
        },
        confirm: function (msg, callback) {
            if (window.swal) {
                window.swal({
                    title: "",
                    text: msg,
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    confirmButtonClass: 'btn-warning',
                    closeOnConfirm: true,
                }, callback);
            } else {
                if (confirm(msg) && callback) callback();
            }
        },
        cookie: function (key, value, expires) {
            if (key === undefined || key === "") return null;
            if (value === undefined) {
                var arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
                if (arr != null) return unescape(arr[2]);
                else return null;
            } else {
                var today = new Date();
                today.setTime(today.getTime());
                if (expires) {
                    expires *= 86400000;
                }
                var expires_date = new Date(today.getTime() + (expires));
                document.cookie = key + "=" + escape(value) + (expires ? ";expires=" + expires_date.toGMTString() : "");
                return value;
            }
        },
        delCookie: function (key) {
            if (key === undefined || key === "") return;
            var exp = new Date();
            exp.setTime(exp.getTime() - 10000);
            var cookieval = SCI.cookie(key);
            if (cookieval != null) document.cookie = key + "=" + cookieval + ";expires=" + exp.toGMTString();
        },
        logOut: function () {
            $.getJSON("/passport/LogOut", {}, function (res) {
                if (res.error == 0) {
                    var retUrl = decodeURIComponent(SCI.getQueryPara('ReturnUrl')) || "/";
                    location.href = retUrl;
                } else {
                    SCI.alert(res.errorMsg);
                }
            });
        },
        date: function (date) {
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
    });

    //-- date --//
    $.extend(SCI.date, {
        addDays: function (date, days) {
            var ret = new Date(date);
            ret.setDate(ret.getDate() + days);
            return ret;
        },
        dayOfWeek: function (day) {
            switch (day) {
                case 1:
                    { return "星期一"; }
                case 2:
                    { return "星期二"; }
                case 3:
                    { return "星期三"; }
                case 4:
                    { return "星期四"; }
                case 5:
                    { return "星期五"; }
                case 6:
                    { return "星期六"; }
                case 7:
                    { return "星期日"; }
                default:
                    { return ""; }
            }
        },
        sameDay: function (date1, date2) {
            if (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()) {
                return true;
            } else {
                return false;
            }
        },
        dayCompare: function (date1, date2) {
            if (typeof date1 === "string") date1 = new Date(date1.replace(/-/g, "/"));
            if (typeof date2 === "string") date2 = new Date(date2.replace(/-/g, "/"));
            date1.setHours(0, 0, 0, 0);
            date2.setHours(0, 0, 0, 0);
            return parseInt((date1 - date2) / (1000 * 3600 * 24));
        },
        getMonthDays: function (year, month) {
            if (typeof year === "string") year = parseInt(year, 10);
            if (typeof month === "string") month = parseInt(month, 10);
            var dayarr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

            if (month == 2) {
                if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                    return 29;
                }
                else {
                    return dayarr[month - 1];
                }
            }
            else {
                return dayarr[month - 1];
            }
        },
        getSiblingsMonday: function (date) {
            var startDt = new Date(date);
            if (startDt.getDay() != 1) startDt.setDate(startDt.getDate() + (startDt.getDay() == 0 ? -6 : 1 - startDt.getDay()));
            return startDt;
        }
    });

    //-- validate --//
    SCI.validate = function (reg, value) {
        if (typeof reg === "string") reg = new RegExp(reg);
        return reg.test(value);
    };
    $.extend(SCI.validate, {
        isInt: function (value, allowMinus) {
            var reg;
            if (allowMinus) reg = /^-?\d+$/;
            else reg = /^\d+$/;
            return SCI.validate(reg, value);
        },
        IntValidate: function (value, min, max) {
            if (typeof value !== "number") {
                if (!SCI.validate.isInt(value, true)) return false;
                value = parseInt(value);
            }
            return (min == null || value >= min) && (max == null || value <= max);
        },
        isNumber: function (value) {
            return SCI.validate(/^-?\d+(.\d+)?$/, value);
        },
        isIDCardNumber: function (value) {
            return SCI.validate(/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/, value);
        },
        isPhoneNumber: function (value, cellPhone) {
            if (cellPhone) return SCI.validate.isMobileNumber(value);
            return SCI.validate(/(^1\d{10}$)|(^(0\d{2,3}-)?(\d{7,8})(-\d{1,4})?$)/, value);
        },
        isMobileNumber: function (value) {
            return SCI.validate(/^0{0,1}(13[0-9]|15[3-9]|15[0-2]|170|18[0-9])[0-9]{8}$/, value);
        },
        isEmail: function (email) {
            if (email.length > 100 || email.length < 6) {
                return false;
            }
            var format = /^[A-Za-z0-9+]+[A-Za-z0-9\.\_\-+]*@([A-Za-z0-9\-]+\.)+[A-Za-z0-9]+$/;
            if (!email.match(format)) {
                return false;
            }
            return true;
        }
    });

    /* datepicker */
    var datePickerInit = false;
    function initDatePicker() {
        if (datePickerInit) return;
        datePickerInit = true;

        $.datepicker.regional["zh-CHS"] = {
            closeText: '关闭',
            prevText: '<上月',
            nextText: '下月>',
            currentText: '今天',
            weekHeader: '周',
            dateFormat: 'yy-mm-dd',
            firstDay: 1,
            showMonthAfterYear: true,
            //changeYear: true,
            monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""],
            monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""],
            dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"]
        };
        $.datepicker.setDefaults($.datepicker.regional["zh-CHS"]);
    }
    SCI.datepicker = function (node, opts) {
        initDatePicker();
        $(node).datepicker(opts);
    };

    window.SCI = SCI;
    //------------------------ SCI end -----------------------//
})(jQuery, window);