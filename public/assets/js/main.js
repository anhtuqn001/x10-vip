var big_image, navbar_initialized, nowuiKit, $navbar, scroll_distance, oVal, transparent = !0, transparentDemo = !0,
    fixedTop = !1, backgroundOrange = !1, toggle_initialized = !1;

function debounce(a, o, r) {
    var l;
    return function () {
        var e = this, t = arguments;
        clearTimeout(l), l = setTimeout(function () {
            l = null, r || a.apply(e, t)
        }, o), r && !l && a.apply(e, t)
    }
}

$(document).ready(function () {
    $('[data-toggle="tooltip"], [rel="tooltip"]').tooltip(), 0 != $(".selectpicker").length && $(".selectpicker").selectpicker({
        iconBase: "now-ui-icons",
        tickIcon: "ui-1_check"
    }), 768 <= $(window).width() && 0 != (big_image = $('.header[data-parallax="true"]')).length && $(window).on("scroll", nowuiKit.checkScrollForParallax), $('[data-toggle="popover"]').each(function () {
        color_class = $(this).data("color"), $(this).popover({template: '<div class="popover popover-' + color_class + '" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'})
    });
    var e = $(".tagsinput").data("color");
    0 != $(".tagsinput").length && $(".tagsinput").tagsinput(), $(".bootstrap-tagsinput").addClass("badge-" + e), nowuiKit.initNavbarImage(), $(".navbar-collapse").addClass("show"), $navbar = $(".navbar[color-on-scroll]"), scroll_distance = $navbar.attr("color-on-scroll") || 500, 0 != $(".navbar[color-on-scroll]").length && (nowuiKit.checkScrollForTransparentNavbar(), $(window).on("scroll", nowuiKit.checkScrollForTransparentNavbar)), $(".form-control").on("focus", function () {
        $(this).parent(".input-group").addClass("input-group-focus")
    }).on("blur", function () {
        $(this).parent(".input-group").removeClass("input-group-focus")
    }), $(".bootstrap-switch").each(function () {
        $this = $(this), data_on_label = $this.data("on-label") || "", data_off_label = $this.data("off-label") || "", $this.bootstrapSwitch({
            onText: data_on_label,
            offText: data_off_label
        })
    }), 992 <= $(window).width() && (big_image = $('.page-header-image[data-parallax="true"]'), $(window).on("scroll", nowuiKit.checkScrollForParallax)), $(".carousel").carousel({interval: 4e3}), 0 != $(".datetimepicker").length && $(".datetimepicker").datetimepicker({
        icons: {
            time: "now-ui-icons tech_watch-time",
            date: "now-ui-icons ui-1_calendar-60",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: "now-ui-icons arrows-1_minimal-left",
            next: "now-ui-icons arrows-1_minimal-right",
            today: "fa fa-screenshot",
            clear: "fa fa-trash",
            close: "fa fa-remove"
        }
    }), 0 != $(".datepicker").length && $(".datepicker").datetimepicker({
        format: "MM/DD/YYYY",
        icons: {
            time: "now-ui-icons tech_watch-time",
            date: "now-ui-icons ui-1_calendar-60",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: "now-ui-icons arrows-1_minimal-left",
            next: "now-ui-icons arrows-1_minimal-right",
            today: "fa fa-screenshot",
            clear: "fa fa-trash",
            close: "fa fa-remove"
        }
    }), 0 != $(".timepicker").length && $(".timepicker").datetimepicker({
        format: "h:mm A",
        icons: {
            time: "now-ui-icons tech_watch-time",
            date: "now-ui-icons ui-1_calendar-60",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: "now-ui-icons arrows-1_minimal-left",
            next: "now-ui-icons arrows-1_minimal-right",
            today: "fa fa-screenshot",
            clear: "fa fa-trash",
            close: "fa fa-remove"
        }
    })
}), $(window).on("resize", function () {
    nowuiKit.initNavbarImage()
}), $(document).on("click", ".navbar-toggler", function () {
    $toggle = $(this), 1 == nowuiKit.misc.navbar_menu_visible ? ($("html").removeClass("nav-open"), nowuiKit.misc.navbar_menu_visible = 0, $("#bodyClick").remove(), setTimeout(function () {
        $toggle.removeClass("toggled")
    }, 550)) : (setTimeout(function () {
        $toggle.addClass("toggled")
    }, 580), div = '<div id="bodyClick"></div>', $(div).appendTo("body").click(function () {
        $("html").removeClass("nav-open"), nowuiKit.misc.navbar_menu_visible = 0, setTimeout(function () {
            $toggle.removeClass("toggled"), $("#bodyClick").remove()
        }, 550)
    }), $("html").addClass("nav-open"), nowuiKit.misc.navbar_menu_visible = 1)
}), nowuiKit = {
    misc: {navbar_menu_visible: 0}, checkScrollForTransparentNavbar: debounce(function () {
        $(document).scrollTop() > scroll_distance ? transparent && (transparent = !1, $(".navbar[color-on-scroll]").removeClass("navbar-transparent")) : transparent || (transparent = !0, $(".navbar[color-on-scroll]").addClass("navbar-transparent"))
    }, 17), initNavbarImage: function () {
        var e = $(".navbar").find(".navbar-translate").siblings(".navbar-collapse"), t = e.data("nav-image");
        null != t && ($(window).width() < 991 || $("body").hasClass("burger-menu") ? e.css("background", "url('" + t + "')").removeAttr("data-nav-image").css("background-size", "cover").addClass("has-image") : e.css("background", "").attr("data-nav-image", "" + t).css("background-size", "").removeClass("has-image"))
    }, initSliders: function () {
        var e = document.getElementById("sliderRegular");
        noUiSlider.create(e, {start: 40, connect: [!0, !1], range: {min: 0, max: 100}});
        var t = document.getElementById("sliderDouble");
        noUiSlider.create(t, {start: [20, 60], connect: !0, range: {min: 0, max: 100}})
    }, checkScrollForParallax: debounce(function () {
        oVal = $(window).scrollTop() / 3, big_image.css({
            transform: "translate3d(0," + oVal + "px,0)",
            "-webkit-transform": "translate3d(0," + oVal + "px,0)",
            "-ms-transform": "translate3d(0," + oVal + "px,0)",
            "-o-transform": "translate3d(0," + oVal + "px,0)"
        })
    }, 6), initContactUsMap: function () {
        var e = new google.maps.LatLng(40.748817, -73.985428), t = {
            zoom: 13,
            center: e,
            scrollwheel: !1,
            styles: [{
                featureType: "water",
                elementType: "geometry",
                stylers: [{color: "#e9e9e9"}, {lightness: 17}]
            }, {
                featureType: "landscape",
                elementType: "geometry",
                stylers: [{color: "#f5f5f5"}, {lightness: 20}]
            }, {
                featureType: "road.highway",
                elementType: "geometry.fill",
                stylers: [{color: "#ffffff"}, {lightness: 17}]
            }, {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{color: "#ffffff"}, {lightness: 29}, {weight: .2}]
            }, {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [{color: "#ffffff"}, {lightness: 18}]
            }, {
                featureType: "road.local",
                elementType: "geometry",
                stylers: [{color: "#ffffff"}, {lightness: 16}]
            }, {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{color: "#f5f5f5"}, {lightness: 21}]
            }, {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{color: "#dedede"}, {lightness: 21}]
            }, {
                elementType: "labels.text.stroke",
                stylers: [{visibility: "on"}, {color: "#ffffff"}, {lightness: 16}]
            }, {
                elementType: "labels.text.fill",
                stylers: [{saturation: 36}, {color: "#333333"}, {lightness: 40}]
            }, {elementType: "labels.icon", stylers: [{visibility: "off"}]}, {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{color: "#f2f2f2"}, {lightness: 19}]
            }, {
                featureType: "administrative",
                elementType: "geometry.fill",
                stylers: [{color: "#fefefe"}, {lightness: 20}]
            }, {
                featureType: "administrative",
                elementType: "geometry.stroke",
                stylers: [{color: "#fefefe"}, {lightness: 17}, {weight: 1.2}]
            }]
        }, a = new google.maps.Map(document.getElementById("contactUsMap"), t);
        new google.maps.Marker({position: e, title: "Hello World!"}).setMap(a)
    }, initContactUs2Map: function () {
        var e = new google.maps.LatLng(40.748817, -73.985428), t = {
            zoom: 13,
            center: e,
            scrollwheel: !1,
            styles: [{
                featureType: "water",
                elementType: "geometry",
                stylers: [{color: "#e9e9e9"}, {lightness: 17}]
            }, {
                featureType: "landscape",
                elementType: "geometry",
                stylers: [{color: "#f5f5f5"}, {lightness: 20}]
            }, {
                featureType: "road.highway",
                elementType: "geometry.fill",
                stylers: [{color: "#ffffff"}, {lightness: 17}]
            }, {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{color: "#ffffff"}, {lightness: 29}, {weight: .2}]
            }, {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [{color: "#ffffff"}, {lightness: 18}]
            }, {
                featureType: "road.local",
                elementType: "geometry",
                stylers: [{color: "#ffffff"}, {lightness: 16}]
            }, {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{color: "#f5f5f5"}, {lightness: 21}]
            }, {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{color: "#dedede"}, {lightness: 21}]
            }, {
                elementType: "labels.text.stroke",
                stylers: [{visibility: "on"}, {color: "#ffffff"}, {lightness: 16}]
            }, {
                elementType: "labels.text.fill",
                stylers: [{saturation: 36}, {color: "#333333"}, {lightness: 40}]
            }, {elementType: "labels.icon", stylers: [{visibility: "off"}]}, {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{color: "#f2f2f2"}, {lightness: 19}]
            }, {
                featureType: "administrative",
                elementType: "geometry.fill",
                stylers: [{color: "#fefefe"}, {lightness: 20}]
            }, {
                featureType: "administrative",
                elementType: "geometry.stroke",
                stylers: [{color: "#fefefe"}, {lightness: 17}, {weight: 1.2}]
            }]
        }, a = new google.maps.Map(document.getElementById("contactUs2Map"), t);
        new google.maps.Marker({position: e, title: "Hello World!"}).setMap(a)
    }
};