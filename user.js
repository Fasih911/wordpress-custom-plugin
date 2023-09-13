/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var key = payment_setting.pk
var urlParams = new URLSearchParams(window.location.search)
var ps_site_url = payment_setting.ps_site_url
var redirect_url = payment_setting.ps_site_url + '/stripe_ideal_redirect_url/'
var payment_method = payment_setting.payment_method
var parking_close_enable = payment_setting.parking_closed_enable
var ajaxurl = payment_setting.ajaxurl
var disabledDate = []
var type = ''
var $ = jQuery
var dateAllowedPicker = ''
var clientSecret = ''
var emailSelector = '.booking_email'

jQuery(document).ready(function () {
    $('.booking_date').keydown(function (e) {
        e.preventDefault();
        return false;
    })
    if (parking_close_enable != 0) {
        var date = new Date();
        const datesForDisable=[]
        var todaydate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
        datesForDisable.push(todaydate)
        jQuery('.booking_date').datepicker({
            format: 'dd/mm/yyyy',
            startDate: '0d',
            autoclose: true,
            datesDisabled: datesForDisable,
            todayHighlight: true
        })
    }
    else {
        jQuery('.booking_date').datepicker({
            format: 'dd/mm/yyyy',
            startDate: '0d',
            autoclose: true,
            todayHighlight: true
        })
    }
    jQuery('.submit_btn_ideal').click(function () {
        if (jQuery(this).hasClass('clicked_element')) {
            return false
        }
        jQuery(this).addClass('clicked_element')
    })
    jQuery(".fa-shopping-cart,  .items_count_con").click(function () {
        if (jQuery(this).parent().find(".cart-details").is(":visible")) {
            jQuery(this).parent().find(".cart-details").slideUp("slow")
        } else {
            jQuery(this).parent().find(".cart-details").slideDown("slow")
        }
    })
    jQuery('.btn-alert-no').click(function () {
        jQuery('#day_ticket_vehicle_details_form_alert').addClass('hidden')
        return false
    })
    jQuery('.btn-alert-yes').click(function () {
        jQuery('#day_ticket_vehicle_details_form_alert').addClass('hidden')
        jQuery('#day_ticket_vehicle_details_form').addClass('hidden')
        jQuery('#day_ticket_vehicle_details_form_confirm').removeClass('hidden')
        return false
    })
    jQuery('.btn-checkout-popup').click(function () {
        checkout_page()

    })
    jQuery('.remove_cart_item').click(function () {
        var key_item = jQuery(this).attr('data-key')
        remove_cart_item(key_item)
    })
    var date = new Date()
    date.setDate(date.getDate())
    dateAllowedPicker = jQuery(".date_allowed").datepicker({
        format: 'dd/mm/yyyy',
        todayHighlight: true,
        startDate: date,
        updateViewDate: false,
        stepMonths: 0,
        datesDisabled: disabledDate
    }).on('changeMonth', function (e) {
        jQuery('.datepicker .datepicker-days table.table-condensed').addClass('loading')
        var d = e.date
        var firstDay = new Date(d.getFullYear(), d.getMonth(), 1)
        var lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0)
        get_booked_dates(firstDay, lastDay, type)
    })
    var date = new Date()
    date.setFullYear(date.getFullYear() - 3)
    jQuery(".booking_dob").datepicker({
        format: 'dd/mm/yyyy',
        keepOpen: false,
        useCurrent: false,
        endDate: date
    })
    jQuery('.step_back').click(function () {
        jQuery('.parking_ticket_details').addClass('hidden')
        jQuery('.booking_detail_form').addClass('hidden')
        jQuery('.checkout_form').addClass('hidden')
        jQuery('.event_ticket_listing').addClass('hidden')
        jQuery('.header-section').removeClass('invisible')
        jQuery('.cart-details').css({ display: "none" });
        jQuery('.step1').removeClass('hidden')
        jQuery('.booking_detail_form #booking_date').removeClass('hidden')
        jQuery('.booking_detail_form #booking_qty').removeClass('hidden')
        jQuery('.booking_detail_form #booking_vehicle_num').removeClass('hidden')
        jQuery('.booking_detail_form #booking_username').removeClass('hidden')
        jQuery('.booking_detail_form #booking_dob').removeClass('hidden')
        resetAllValues()
    })
    // Day Person Ticket Handling
    jQuery('#day_ticket_person').click(function () {
        jQuery('.alert_message').html('');
        var product_amount = jQuery($(this)).data('id');
        const formated_amount = formatAmount(product_amount)
        var product_id = jQuery($(this)).data('product');
        const qty = $('#booking_quantity').val()
        if (qty=="" || qty==null) {
            $('#booking_quantity').val(1)
        }
        jQuery('.parking_ticket_form #day_ticket_person #day_person_price').val(formated_amount)
        jQuery('.parking_ticket_form #day_ticket_person #hidden_amount').val(product_amount)
        jQuery('.parking_ticket_form #day_ticket_person #product_id').val(product_id)
        var $parent = jQuery(emailSelector).parent();
        jQuery('.szbl-mailcheck-msg', $parent).remove();
        if (jQuery(this).hasClass("sold-out")) {
            return;
        }
        jQuery('.step1').addClass('hidden');
        jQuery('.cart-details').hide();
        jQuery('.parking_ticket_form #day_ticket_person').removeClass('hidden');
        jQuery('#ticket_type').val('day_ticket_person');
        //jQuery('.steps_con').addClass('loading');
        type = 'person';
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        get_booked_dates(firstDay, lastDay, type);
    });
    //    Day Ticket Vehicle Handling
    jQuery('#day_ticket_vehicle').click(function () {
        var product_amount = jQuery((this)).data('id');
        var product_id = jQuery((this)).data('product');
        const formated_amount = formatAmount(product_amount)
        jQuery('.parking_ticket_form #day_ticket_vehicle #day_vehicle_price').val(formated_amount)
        jQuery('.parking_ticket_form #day_ticket_vehicle #hidden_amount').val(product_amount)
        jQuery('.parking_ticket_form #day_ticket_vehicle #product_id').val(product_id)
        jQuery('.overlay').removeClass('hidden')
        jQuery('.alert_message').html('')
        jQuery('.step1').addClass('hidden')
        jQuery('.cart-details').hide()
        jQuery('.parking_ticket_form #day_ticket_vehicle').removeClass('hidden')
        //jQuery('.steps_con').addClass('loading');
        jQuery('.day_ticket_info').removeClass('hidden')
        jQuery('#ticket_type').val('day_ticket_vehicle');
        type = 'parking';
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        get_booked_dates(firstDay, lastDay, type);
        jQuery('.overlay').addClass('hidden')
        jQuery('#day_ticket_vehicle_details').removeClass('hidden')
    })
    //hourly ticket 
    jQuery('#hourly_ticket_vehicle').click(function () {
        jQuery('.alert_message').html('');
        var $parent = jQuery(emailSelector).parent();
        jQuery('.szbl-mailcheck-msg', $parent).remove();
        jQuery('.step1').addClass('hidden');
        jQuery('.cart-details').hide();
        jQuery('#ticket_type').val('hourly_ticket_vehicle');
        jQuery('.parking_ticket_form #hourly_ticket_vehicle').removeClass('hidden');
    });
    // Yearly Person Ticket
    jQuery("#yearly_ticket_person").click(function () {
        var product_amount = jQuery($(this)).data('id');
        var product_id = jQuery($(this)).data('product');
        const formated_amount = formatAmount(product_amount)
        jQuery('.parking_ticket_form #yearly_ticket_person #yearly_person_price').val(formated_amount)
        jQuery('.parking_ticket_form #yearly_ticket_person #hidden_amount').val(product_amount)
        jQuery('.parking_ticket_form #yearly_ticket_person #product_id').val(product_id)
        jQuery(".alert_message").html("");
        var a = jQuery(emailSelector).parent()
        jQuery(".szbl-mailcheck-msg", a).remove()
        jQuery(".step1").addClass("hidden")
        jQuery(".cart-details").hide()
        jQuery('#ticket_type').val('yearly_ticket_person');
        jQuery(".parking_ticket_form #yearly_ticket_person").removeClass("hidden");
    }),
        // Yearly Vehicle Ticket
        jQuery("#yearly_ticket_vehicle").click(function () {
            var product_amount = jQuery($(this)).data('id');
            var product_id = jQuery($(this)).data('product');
            const formated_amount = formatAmount(product_amount)
            jQuery('.parking_ticket_form #yearly_ticket_vehicle #yearly_vehicle_price').val(formated_amount)
            jQuery('.parking_ticket_form #yearly_ticket_vehicle #hidden_amount').val(product_amount)
            jQuery('.parking_ticket_form #yearly_ticket_vehicle #product_id').val(product_id)
            jQuery(".alert_message").html("");
            var a = jQuery(emailSelector).parent();
            jQuery(".szbl-mailcheck-msg", a).remove()
            jQuery(".step1").addClass("hidden")
            jQuery(".cart-details").hide()
            jQuery('#ticket_type').val('yearly_ticket_vehicle');
            jQuery(".parking_ticket_form #yearly_ticket_vehicle").removeClass("hidden")
        }),
        jQuery('.booking_details_form_submit').click(function () {
            jQuery('.alert_message').html('')
            jQuery('.cart-details').hide()
            jQuery('.overlay').removeClass('hidden')
            var languange
            var ticket_type = jQuery('#ticket_type').val()
            var location_id = jQuery('#location_id').val()
            if (ticket_type == "day_ticket_vehicle") {
                var amount = jQuery('.parking_ticket_form #day_ticket_vehicle #hidden_amount').val()
                var day_ticket_price = jQuery('.parking_ticket_form #day_ticket_vehicle #day_vehicle_price').val()
                var vehicle_num = jQuery('.parking_ticket_form #day_ticket_vehicle .vehicle_num').val()
                var booking_date = jQuery('.parking_ticket_form #day_ticket_vehicle .booking_date').val()
                var booking_email = jQuery('.parking_ticket_form #day_ticket_vehicle .booking_email').val()
                jQuery('#booking_detail_email').val(booking_email)
                jQuery('#booking_detail_date').val(booking_date)
                jQuery('#booking_detail_vehicle_num').val(vehicle_num)
                jQuery('#booking_detail_amount').val(amount)
                var error = 0
                if (vehicle_num === '') {
                    error = 1
                    jQuery('.parking_ticket_form #day_ticket_vehicle .vehicle_num').addClass('required-missing')
                } else {
                    jQuery('.parking_ticket_form #day_ticket_vehicle .vehicle_num').removeClass('required-missing')
                }
                if (booking_date === '') {
                    error = 1
                    jQuery('.parking_ticket_form #day_ticket_vehicle .booking_date').addClass('required-missing')
                } else {
                    jQuery('.parking_ticket_form #day_ticket_vehicle .booking_date').removeClass('required-missing')
                }
                if (booking_email !== '' && !booking_email.match(/^[\w\d\.\-\_']+@([\w\d\-]+\.)+\w{2,}$/)) {
                    error = 1
                    var fd = new FormData()
                    fd.append('action', 'get_default_lang')
                    jQuery.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        data: fd,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        complete: function (data) {
                            languange = data.responseJSON.lang
                            var $parent = jQuery('.booking_email')
                            jQuery('.szbl-mailcheck-msg', $parent).remove()
                            jQuery('.parking_ticket_form #day_ticket_vehicle .booking_email').addClass('required-missing')
                            if (data.responseJSON.status === 1 && data.responseJSON.lang === 'nl') {
                                $parent.append('<span class="szbl-mailcheck-msg">Gelieve een geldig e-mailadres in te geven.</span>')
                            } else {
                                $parent.append('<span class="szbl-mailcheck-msg">Please enter a valid email address.</span>')
                            }
                        }
                    })
                } else {
                    var $parent = jQuery('.booking_email').parent()
                    jQuery('.szbl-mailcheck-msg', $parent).remove()
                    jQuery('.booking_email').removeClass('required-missing')
                }

                if (error === 1) {
                    var fd = new FormData()
                    var error_html = ''
                    fd.append('action', 'get_default_lang')
                    jQuery.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        data: fd,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        complete: function (data) {
                            if (data.responseJSON.lang === 'nl') {
                                var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>Alle velden gemarkeerd met (*) zijn verplicht.</div>'
                                jQuery('.alert_message').html(error_html)
                            } else {
                                var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>All fields marked with (*) are required.</div>'
                                jQuery('.alert_message').html(error_html)
                            }
                        }
                    })
                    jQuery('.overlay').addClass('hidden')
                    return false

                }
                var fd = new FormData()
                fd.append("vehicle_num", vehicle_num)
                fd.append("booking_date", booking_date)
                fd.append('action', 'get_vehicle_price_day')
                jQuery.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: fd,
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    complete: function (data) {
                        if (data.responseJSON.status === 1) {
                            jQuery('.parking_ticket_form #day_ticket_vehicle').addClass('hidden')
                            jQuery('.booking_detail_form').removeClass('hidden')
                            jQuery('.booking_detail_form .label_amount').html(day_ticket_price)
                            jQuery('.booking_detail_form .label_vehicle').html(vehicle_num)
                            jQuery('.booking_detail_form .label_booking_date').html(booking_date)
                            jQuery('.booking_detail_form .label_booking_email').html(booking_email)
                            jQuery('.booking_detail_form .hidden_booking').val(data.responseJSON.booking)
                            jQuery('.booking_detail_form .hidden_existing_booking').val(data.responseJSON.existing_booking)
                            jQuery('.booking_detail_form .hidden_amount').val(data.responseJSON.amount)
                            jQuery('.booking_detail_form #booking_qty').addClass('hidden')
                            jQuery('.booking_detail_form #booking_username').addClass('hidden')
                            jQuery('.booking_detail_form #booking_dob').addClass('hidden')
                            if (data.responseJSON.is_alert === 1) {
                                jQuery('#parking_ticket_details').removeClass('hidden')
                            } else {
                                jQuery('#parking_ticket_details').addClass('hidden')
                                jQuery('#parking_ticket_details_form_confirm').removeClass('hidden')
                            }
                        } else {
                            var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>' + data.responseJSON.message + '</div>'
                            jQuery('.alert_message').html(error_html)
                        }
                        jQuery('.overlay').addClass('hidden')
                        jQuery('.overlay').addClass('hidden')
                    }
                })
            }
            if (ticket_type == "day_ticket_person") {
                var amount = jQuery('.parking_ticket_form #day_ticket_person #hidden_amount').val()
                var person_ticket_price = jQuery('.parking_ticket_form #day_ticket_person #day_person_price').val()
                var booking_date = jQuery('.parking_ticket_form #day_ticket_person .booking_date').val()
                var booking_email = jQuery('.parking_ticket_form #day_ticket_person .booking_email').val()
                var booking_quantity = jQuery('.parking_ticket_form #day_ticket_person .booking_quantity').val()
                jQuery('#booking_detail_email').val(booking_email)
                jQuery('#booking_detail_date').val(booking_date)
                jQuery('#booking_detail_amount').val(amount)
                jQuery('#booking_detail_quantity').val(booking_quantity)
                var error = 0
                if (booking_quantity === '') {
                    error = 1
                    jQuery('.parking_ticket_form #day_ticket_person .booking_quantity').addClass('required-missing')
                } else {
                    jQuery('.parking_ticket_form #day_ticket_person .booking_quantity').removeClass('required-missing')
                }
                if (booking_date === '') {
                    error = 1
                    jQuery('.parking_ticket_form #day_ticket_vehicle .booking_date').addClass('required-missing')
                } else {
                    jQuery('.parking_ticket_form #day_ticket_vehicle .booking_date').removeClass('required-missing')
                }
                if (booking_email !== '' && !booking_email.match(/^[\w\d\.\-\_']+@([\w\d\-]+\.)+\w{2,}$/)) {
                    error = 1
                    var fd = new FormData()
                    fd.append('action', 'get_default_lang')
                    jQuery.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        data: fd,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        complete: function (data) {
                            languange = data.responseJSON.lang
                            var $parent = jQuery('.booking_email')
                            jQuery('.szbl-mailcheck-msg', $parent).remove()
                            jQuery('.parking_ticket_form #day_ticket_vehicle .booking_email').addClass('required-missing')
                            if (data.responseJSON.status === 1 && data.responseJSON.lang === 'nl') {
                                $parent.append('<span class="szbl-mailcheck-msg">Gelieve een geldig e-mailadres in te geven.</span>')
                            } else {
                                $parent.append('<span class="szbl-mailcheck-msg">Please enter a valid email address.</span>')
                            }
                        }
                    })
                } else {
                    var $parent = jQuery('.booking_email').parent()
                    jQuery('.szbl-mailcheck-msg', $parent).remove()
                    jQuery('.booking_email').removeClass('required-missing')
                }

                if (error === 1) {
                    var fd = new FormData()
                    var error_html = ''
                    fd.append('action', 'get_default_lang')
                    jQuery.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        data: fd,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        complete: function (data) {
                            if (data.responseJSON.lang === 'nl') {
                                var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>Alle velden gemarkeerd met (*) zijn verplicht.</div>'
                                jQuery('.alert_message').html(error_html)
                            } else {
                                var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>All fields marked with (*) are required.</div>'
                                jQuery('.alert_message').html(error_html)
                            }
                        }
                    })


                    jQuery('.overlay').addClass('hidden')
                    return false

                }
                var fd = new FormData();
                fd.append("type_query", 'person');
                fd.append("booking_date", booking_date);
                fd.append("quantity", booking_quantity);
                fd.append('action', 'get_tickets_availability_future_date');
                jQuery.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: fd,
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    complete: function (data) {
                        if (data.responseJSON.status === 1) {
                            jQuery('.parking_ticket_form #day_ticket_person').addClass('hidden')
                            jQuery('.booking_detail_form').removeClass('hidden')
                            jQuery('.booking_detail_form .label_amount').html(person_ticket_price)
                            jQuery('.booking_detail_form .label_booking_date').html(booking_date)
                            jQuery('.booking_detail_form .label_booking_email').html(booking_email)
                            jQuery('.booking_detail_form .label_booking_quantity').html(booking_quantity)
                            jQuery('.booking_detail_form .hidden_amount').val(amount)
                            jQuery('.booking_detail_form #booking_vehicle_num').addClass('hidden')
                            jQuery('.booking_detail_form #booking_username').addClass('hidden')
                            jQuery('.booking_detail_form #booking_dob').addClass('hidden')
                            if (data.responseJSON.is_alert === 1) {
                                jQuery('#parking_ticket_details').removeClass('hidden')
                            } else {
                                jQuery('#parking_ticket_details').addClass('hidden')
                                jQuery('#parking_ticket_details_form_confirm').removeClass('hidden')
                            }
                        } else {
                            var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>' + data.responseJSON.message + '</div>'
                            jQuery('.alert_message').html(error_html)
                        }
                        jQuery('.overlay').addClass('hidden')
                    }
                })
            }
            if (ticket_type == "hourly_ticket_vehicle") {
                var product_id = jQuery('.parking_ticket_form #hourly_ticket_vehicle #product_id').val()
                var product_name = jQuery('.parking_ticket_form #hourly_ticket_vehicle .product_name').val()
                var vehicle_num = jQuery('.parking_ticket_form #hourly_ticket_vehicle .vehicle_num').val()
                var booking_email = jQuery('.parking_ticket_form #hourly_ticket_vehicle .booking_email').val()
                jQuery('#booking_detail_email').val(booking_email)
                jQuery('#booking_detail_vehicle_num').val(vehicle_num)
                var error = 0
                if (vehicle_num === '') {
                    error = 1
                    jQuery('.parking_ticket_form #hourly_ticket_vehicle .vehicle_num').addClass('required-missing')
                } else {
                    jQuery('.parking_ticket_form #hourly_ticket_vehicle .vehicle_num').removeClass('required-missing')
                }
                if (booking_email !== '' && !booking_email.match(/^[\w\d\.\-\_']+@([\w\d\-]+\.)+\w{2,}$/)) {
                    error = 1
                    var fd = new FormData()
                    fd.append('action', 'get_default_lang')
                    jQuery.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        data: fd,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        complete: function (data) {
                            languange = data.responseJSON.lang
                            var $parent = jQuery('.booking_email')
                            jQuery('.szbl-mailcheck-msg', $parent).remove()
                            jQuery('.parking_ticket_form #hourly_ticket_vehicle .booking_email').addClass('required-missing')
                            if (data.responseJSON.status === 1 && data.responseJSON.lang === 'nl') {
                                $parent.append('<span class="szbl-mailcheck-msg">Gelieve een geldig e-mailadres in te geven.</span>')
                            } else {
                                $parent.append('<span class="szbl-mailcheck-msg">Please enter a valid email address.</span>')
                            }
                        }
                    })
                } else {
                    var $parent = jQuery('.booking_email').parent()
                    jQuery('.szbl-mailcheck-msg', $parent).remove()
                    jQuery('.parking_ticket_form #hourly_ticket_vehicle .booking_email').removeClass('required-missing')
                }

                if (error === 1) {
                    var fd = new FormData()
                    var error_html = ''
                    fd.append('action', 'get_default_lang')
                    jQuery.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        data: fd,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        complete: function (data) {
                            if (data.responseJSON.lang === 'nl') {
                                var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>Alle velden gemarkeerd met (*) zijn verplicht.</div>'
                                jQuery('.alert_message').html(error_html)
                            } else {
                                var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>All fields marked with (*) are required.</div>'
                                jQuery('.alert_message').html(error_html)
                            }
                        }
                    })


                    jQuery('.overlay').addClass('hidden')
                    return false

                }
                var fd = new FormData();
                fd.append("vehicle_num", vehicle_num);
                fd.append("booking_email", booking_email);
                fd.append('action', 'get_vehicle_price');
                jQuery.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: fd,
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    complete: function (data) {
                        if (data.responseJSON.status === 1) {
                            jQuery('.booking_detail_form').removeClass('hidden')
                            jQuery('.booking_detail_form .label_amount').html('€' + data.responseJSON.display_amount)
                            jQuery('.booking_detail_form .label_vehicle').html(vehicle_num)
                            jQuery('.booking_detail_form .label_booking_email').html(booking_email)
                            jQuery('.booking_detail_form .hidden_amount').val(data.responseJSON.amount)
                            if (data.responseJSON.is_alert === 1) {
                                jQuery('#parking_ticket_details').removeClass('hidden')
                            } else {
                                jQuery('#parking_ticket_details').addClass('hidden')
                                jQuery('#parking_ticket_details_form_confirm').removeClass('hidden')
                            }
                        } else {
                            var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>' + data.responseJSON.message + '</div>'
                            jQuery('.alert_message').html(error_html)
                        }
                        jQuery('.overlay').addClass('hidden')
                    }
                })
            }
            if (ticket_type == "yearly_ticket_vehicle") {
                jQuery('.overlay').removeClass('hidden')
                var product_id = jQuery('.parking_ticket_form #yearly_ticket_vehicle #product_id').val()
                var amount = jQuery('.parking_ticket_form #yearly_ticket_vehicle #hidden_amount').val()
                var person_ticket_price = jQuery('.parking_ticket_form #yearly_ticket_vehicle #yearly_vehicle_price').val()
                var product_name = jQuery('.parking_ticket_form #yearly_ticket_vehicle .product_name').val()
                var user_name = jQuery('.parking_ticket_form #yearly_ticket_vehicle .booking_user_name').val()
                var vehicle_num = jQuery('.parking_ticket_form #yearly_ticket_vehicle .vehicle_num').val()
                var booking_email = jQuery('.parking_ticket_form #yearly_ticket_vehicle .booking_email').val()
                jQuery('#booking_detail_amount').val(amount)
                jQuery('#booking_detail_email').val(booking_email)
                jQuery('#booking_detail_vehicle_num').val(vehicle_num)
                jQuery('#booking_detail_user_name').val(user_name)
                var error = 0
                if (vehicle_num === '') {
                    error = 1
                    jQuery('.parking_ticket_form #yearly_ticket_vehicle .vehicle_num').addClass('required-missing')
                } else {
                    jQuery('.parking_ticket_form #yearly_ticket_vehicle .vehicle_num').removeClass('required-missing')
                }
                if (booking_email !== '' && !booking_email.match(/^[\w\d\.\-\_']+@([\w\d\-]+\.)+\w{2,}$/)) {
                    error = 1
                    var fd = new FormData()
                    fd.append('action', 'get_default_lang')
                    jQuery.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        data: fd,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        complete: function (data) {
                            languange = data.responseJSON.lang
                            var $parent = jQuery('.booking_email')
                            jQuery('.szbl-mailcheck-msg', $parent).remove()
                            jQuery('.parking_ticket_form #hourly_ticket_vehicle .booking_email').addClass('required-missing')
                            if (data.responseJSON.status === 1 && data.responseJSON.lang === 'nl') {
                                $parent.append('<span class="szbl-mailcheck-msg">Gelieve een geldig e-mailadres in te geven.</span>')
                            } else {
                                $parent.append('<span class="szbl-mailcheck-msg">Please enter a valid email address.</span>')
                            }
                        }
                    })
                } else {
                    var $parent = jQuery('.booking_email').parent()
                    jQuery('.szbl-mailcheck-msg', $parent).remove()
                    jQuery('.parking_ticket_form #hourly_ticket_vehicle .booking_email').removeClass('required-missing')
                }

                if (error === 1) {
                    var fd = new FormData()
                    var error_html = ''
                    fd.append('action', 'get_default_lang')
                    jQuery.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        data: fd,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        complete: function (data) {
                            if (data.responseJSON.lang === 'nl') {
                                var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>Alle velden gemarkeerd met (*) zijn verplicht.</div>'
                                jQuery('.alert_message').html(error_html)
                            } else {
                                var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>All fields marked with (*) are required.</div>'
                                jQuery('.alert_message').html(error_html)
                            }
                        }
                    })
                    jQuery('.overlay').addClass('hidden')
                    return false
                }
                jQuery('.parking_ticket_form #yearly_ticket_vehicle').addClass('hidden')
                jQuery('.booking_detail_form').removeClass('hidden')
                jQuery('.booking_detail_form .label_amount').html(person_ticket_price)
                jQuery('.booking_detail_form .label_user_name').html(user_name)
                jQuery('.booking_detail_form .label_vehicle').html(vehicle_num)
                jQuery('.booking_detail_form .label_booking_email').html(booking_email)
                jQuery('.booking_detail_form .hidden_amount').val(yearly_ticket_price)
                jQuery('.booking_detail_form #booking_date').addClass('hidden')
                jQuery('.booking_detail_form #booking_qty').addClass('hidden')
                jQuery('.booking_detail_form #booking_dob').addClass('hidden')
                jQuery('.overlay').addClass('hidden')
            }
            if (ticket_type == "yearly_ticket_person") {
                jQuery('.overlay').removeClass('hidden')
                var amount = jQuery('.parking_ticket_form #yearly_ticket_person #hidden_amount').val()
                var yearly_ticket_price = jQuery('.parking_ticket_form #yearly_ticket_person #yearly_person_price').val()
                var product_id = jQuery('.parking_ticket_form #yearly_ticket_person #product_id').val()
                var product_name = jQuery('.parking_ticket_form #yearly_ticket_person .product_name').val()
                var booking_email = jQuery('.parking_ticket_form #yearly_ticket_person .booking_email').val()
                var booking_name = jQuery('.parking_ticket_form #yearly_ticket_person .booking_user_name').val()
                var booking_dob = jQuery('.parking_ticket_form #yearly_ticket_person .booking_dob').val()
                jQuery('#booking_detail_amount').val(amount)
                jQuery('#booking_detail_email').val(booking_email)
                jQuery('#booking_detail_user_name').val(booking_name)
                jQuery('#booking_detail_dob').val(booking_dob)
                var error = 0
                if (booking_email !== '' && !booking_email.match(/^[\w\d\.\-\_']+@([\w\d\-]+\.)+\w{2,}$/)) {
                    error = 1
                    var fd = new FormData()
                    fd.append('action', 'get_default_lang')
                    jQuery.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        data: fd,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        complete: function (data) {
                            languange = data.responseJSON.lang
                            var $parent = jQuery('.booking_email')
                            jQuery('.szbl-mailcheck-msg', $parent).remove()
                            jQuery('.parking_ticket_form #hourly_ticket_vehicle .booking_email').addClass('required-missing')
                            if (data.responseJSON.status === 1 && data.responseJSON.lang === 'nl') {
                                $parent.append('<span class="szbl-mailcheck-msg">Gelieve een geldig e-mailadres in te geven.</span>')
                            } else {
                                $parent.append('<span class="szbl-mailcheck-msg">Please enter a valid email address.</span>')
                            }
                        }
                    })
                } else {
                    var $parent = jQuery('.booking_email').parent()
                    jQuery('.szbl-mailcheck-msg', $parent).remove()
                    jQuery('.parking_ticket_form #hourly_ticket_vehicle .booking_email').removeClass('required-missing')
                }

                if (error === 1) {
                    var fd = new FormData()
                    var error_html = ''
                    fd.append('action', 'get_default_lang')
                    jQuery.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        data: fd,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        complete: function (data) {
                            if (data.responseJSON.lang === 'nl') {
                                var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>Alle velden gemarkeerd met (*) zijn verplicht.</div>'
                                jQuery('.alert_message').html(error_html)
                            } else {
                                var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>All fields marked with (*) are required.</div>'
                                jQuery('.alert_message').html(error_html)
                            }
                        }
                    })


                    jQuery('.overlay').addClass('hidden')
                    return false

                }
                jQuery('.parking_ticket_form #yearly_ticket_person').addClass('hidden')
                jQuery('.booking_detail_form').removeClass('hidden')
                jQuery('.booking_detail_form .label_user_name').html(booking_name)
                jQuery('.booking_detail_form .label_amount').html(yearly_ticket_price)
                jQuery('.booking_detail_form .label_booking_email').html(booking_email)
                jQuery('.booking_detail_form .label_dob').html(booking_dob)
                jQuery('.booking_detail_form .hidden_amount').val(yearly_ticket_price)
                jQuery('.booking_detail_form #booking_date').addClass('hidden')
                jQuery('.booking_detail_form #booking_qty').addClass('hidden')
                jQuery('.booking_detail_form #booking_vehicle_num').addClass('hidden')
                jQuery('.overlay').addClass('hidden')
            }

        })
    jQuery('.add_to_cart').click(function () {
        jQuery('.alert_message').html('')
        jQuery('.overlay').removeClass('hidden')
        jQuery('.cart-details').hide()
        var ticket_type = jQuery('#ticket_type').val()
        var location_id = jQuery('.parking_tickets #location_id').val()
        var product_name = jQuery('#product_name').val()
        var vehicle_num = jQuery('#booking_detail_vehicle_num').val()
        var booking_id = jQuery('#hidden_booking').val()
        var booking_date = jQuery('#booking_detail_date').val()
        var booking_email = jQuery('#booking_detail_email').val()
        var booking_quantity = jQuery('#booking_detail_quantity').val()
        var booking_dob = jQuery('#booking_detail_dob').val()
        var amount = jQuery('#booking_detail_amount').val()
        // amount = amount;
        var fd = new FormData()
        if (ticket_type == "day_ticket_vehicle") {
            fd.append("type", 1)
            fd.append("product_name", 'day_vehicle_ticket')
            fd.append("vehicle_num", vehicle_num)
            var product_id = jQuery('.parking_ticket_form #day_ticket_vehicle #product_id').val()
            fd.append('product_id', product_id)
        }
        if (ticket_type == "day_ticket_person") {
            fd.append("type", 1)
            fd.append("product_name", 'day_person_ticket')
            fd.append('quantity', booking_quantity)
            var product_id = jQuery('.parking_ticket_form #day_ticket_person #product_id').val()
            fd.append('product_id', product_id)
        }
        if (ticket_type == "yearly_ticket_vehicle") {
            var name = jQuery('.parking_ticket_form #yearly_ticket_vehicle .booking_user_name').val()
            fd.append('user_name', name)
            fd.append("type", 3)
            fd.append("product_name", 'yearly_vehicle')
            fd.append("vehicle_num", vehicle_num)
            var product_id = jQuery('.parking_ticket_form #yearly_ticket_vehicle #product_id').val()
            fd.append('product_id', product_id)
        }
        if (ticket_type == "yearly_ticket_person") {
            var name = jQuery('.parking_ticket_form #yearly_ticket_person .booking_user_name').val()
            fd.append('user_name', name)
            fd.append("type", 3)
            fd.append("product_name", 'yearly_person')
            fd.append("dob", booking_dob)
            var product_id = jQuery('.parking_ticket_form #yearly_ticket_person #product_id').val()
            fd.append('product_id', product_id)
        }
        fd.append("booking_date", booking_date)
        fd.append("booking_id", booking_id)
        fd.append("location_id", location_id)
        fd.append("booking_email", booking_email)
        fd.append("amount", amount)
        fd.append('action', 'add_item_to_cart')
        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: fd,
            contentType: false,
            processData: false,
            dataType: 'json',
            complete: function (data) {
                if (data.responseJSON.status === 1) {
                    jQuery('.overlay').addClass('hidden')
                    jQuery('.cart-details').html(data.responseJSON.cart_html)
                    jQuery('.items_count_con').html(data.responseJSON.cart_count)
                    reset_payment_form()
                    jQuery('.btn-checkout-popup').click(function () {
                        checkout_page()

                    })
                    jQuery('input[name="location"]').prop('checked', false)
                    return false
                } else {
                    var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>Something went wrong please try again.</div>'
                    jQuery('.alert_message').html(error_html)
                }
                jQuery('.overlay').addClass('hidden')
            }
        })
    })
    jQuery('.show_details_confirm').click(function () {
        jQuery('.overlay').removeClass('hidden')
        var location_id = jQuery('.parking_tickets #location_id').val()
        var ticket_type =jQuery('#ticket_type').val()
        var product_name = jQuery('#product_name').val()
        var vehicle_num = jQuery('#booking_detail_vehicle_num').val()
        var booking_id = jQuery('#hidden_booking').val()
        var booking_date = jQuery('#booking_detail_date').val()
        var booking_email = jQuery('#booking_detail_email').val()
        var booking_quantity = jQuery('#booking_detail_quantity').val()
        var amount = jQuery('#booking_detail_amount').val()
        var fd = new FormData()
        if (ticket_type == "day_ticket_vehicle") {
            fd.append("type", 1)
            fd.append("product_name", 'day_vehicle_ticket')
            fd.append("vehicle_num", vehicle_num)
            var product_id = jQuery('.parking_ticket_form #day_ticket_vehicle #product_id').val()
            fd.append('product_id', product_id)
        }
        if (ticket_type == "day_ticket_person") {
            fd.append("type", 1)
            fd.append("product_name", 'day_person_ticket')
            fd.append('quantity', booking_quantity)
            var product_id = jQuery('.parking_ticket_form #day_ticket_person #product_id').val()
            fd.append('product_id', product_id)
        }
        if (ticket_type == "yearly_ticket_vehicle") {
            var name = jQuery('.parking_ticket_form #yearly_ticket_vehicle .booking_user_name').val()
            fd.append('user_name', name)
            fd.append("type", 3)
            fd.append("product_name", 'yearly_vehicle')
            fd.append("vehicle_num", vehicle_num)
            var product_id = jQuery('.parking_ticket_form #yearly_ticket_vehicle #product_id').val()
            fd.append('product_id', product_id)
        }
        if (ticket_type == "yearly_ticket_person") {
            var name = jQuery('.parking_ticket_form #yearly_ticket_person .booking_user_name').val()
            fd.append('user_name',name)
            fd.append("type", 3)
            fd.append("product_name", 'yearly_person')
            fd.append("dob", booking_dob)
            var product_id = jQuery('.parking_ticket_form #yearly_ticket_person #product_id').val()
            fd.append('product_id', product_id)
        }
        fd.append("booking_date", booking_date)
        fd.append("booking_id", booking_id)
        fd.append("location_id", location_id)
        fd.append("booking_email", booking_email)
        fd.append("amount", amount)
        fd.append('action', 'add_item_to_cart')
        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: fd,
            contentType: false,
            processData: false,
            dataType: 'json',
            complete: function (data) {
                if (data.responseJSON.status === 1) {
                    jQuery('.overlay').addClass('hidden');
                    jQuery('.booking_detail_form').addClass('hidden')
                    jQuery('.checkout_form_content').html(data.responseJSON.checkout_html);
                    jQuery('.cart-details').html(data.responseJSON.cart_html);
                    jQuery('.items_count_con').html(data.responseJSON.cart_count);
                    //reset_payment_form();
                    jQuery('.btn-checkout-popup').click(function () {
                        checkout_page();

                    });
                    jQuery('.remove_cart_item').click(function () {
                        var key_item = jQuery(this).attr('data-key');
                        remove_cart_item(key_item);
                    });
                    jQuery('.step1').addClass('hidden');
                    jQuery('.checkout_form').removeClass('hidden');
                    jQuery('.header-section').addClass('invisible');
                    jQuery('input[name="location"]').prop('checked', false);
                    return false;
                } else {
                    var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>Something went wrong please try again.</div>';
                    jQuery('.alert_message').html(error_html);
                }
                jQuery('.overlay').addClass('hidden');
            }
        })
    })
    jQuery('.lang-nl-flag').click(function () {
        jQuery('.alert_message').html('');
        jQuery('.overlay').removeClass('hidden');
        var fd = new FormData();
        fd.append("lang", 'nl');
        fd.append('action', 'set_default_lang');
        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: fd,
            contentType: false,
            processData: false,
            dataType: 'json',
            complete: function (data) {
                window.location.href = ps_site_url;
                jQuery('.overlay').addClass('hidden');
            }
        });
    });
    jQuery('.lang-en-flag').click(function () {
        jQuery('.alert_message').html('');
        jQuery('.overlay').removeClass('hidden');
        var fd = new FormData();
        fd.append("lang", 'en');
        fd.append('action', 'set_default_lang');
        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: fd,
            contentType: false,
            processData: false,
            dataType: 'json',
            complete: function (data) {
                window.location.href = ps_site_url;
                jQuery('.overlay').addClass('hidden');
            }
        });
    });
    jQuery('.pay_card').click(function () {
        jQuery('.alert_message').html('');
        if (jQuery('#privacy_policy').prop("checked") === false) {
            var fd = new FormData();
            fd.append('action', 'get_privacy_policy_error');
            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                data: fd,
                contentType: false,
                processData: false,
                dataType: 'json',
                complete: function (data) {
                    if (data.responseJSON.status) {
                        var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>' + data.responseJSON.message + '</div>';
                        jQuery('.alert_message').html(error_html);
                    }
                }
            });
        } else {
            if (payment_method == "stripe") {
                jQuery('.overlay').removeClass('hidden');
                jQuery('.checkout_form').addClass('hidden');
                jQuery('.payment_form_card').removeClass('hidden');
                var stripe = Stripe(key);
                var elements = stripe.elements();
                var style = {
                    base: {
                        color: '#32325d',
                        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                        fontSmoothing: 'antialiased',
                        fontSize: '16px',
                        '::placeholder': {
                            color: '#aab7c4'
                        }
                    },
                    invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a'
                    }
                };
                var card = elements.create('card', { style: style });
                card.mount('#card-element');
                var newsletterSubscription = 0;
                if (jQuery('#newsletter_subscription').prop("checked") === true) {
                    newsletterSubscription = 1;
                }
                var fd = new FormData();
                fd.append('action', 'get_total_cart_price');
                fd.append('type', 'pay_card');
                fd.append('newsletter_subscription', newsletterSubscription);
                jQuery.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: fd,
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    complete: function (data) {
                        if (typeof data.responseJSON.error !== 'undefined') {
                            var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>' + data.responseJSON.error + '</div>';
                            jQuery('.alert_message').html(error_html);
                            jQuery('.checkout_form').removeClass('hidden');
                            jQuery('.payment_form_card').addClass('hidden');
                        } else {
                            jQuery('.alert_message').html('');
                            clientSecret = data.responseJSON.clientSecret;
                            jQuery(form).find('.color-blue').removeAttr("disabled").button('refresh');
                        }
                    }
                });
                card.addEventListener('change', function (event) {
                    if (event.error) {
                        var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>' + event.error.message + '</div>';
                        jQuery('.alert_message').html(error_html);
                    } else {
                        jQuery('.alert_message').html('');
                    }
                });
                var form = document.getElementById('payment-form-card');
                form.addEventListener('submit', function (event) {
                    event.preventDefault();
                    jQuery('.overlay').removeClass('hidden');
                    jQuery('.alert_message').empty();
                    jQuery(form).find('.color-blue').attr("disabled", "disabled").button('refresh');
                    stripe.confirmCardPayment(clientSecret, {
                        payment_method: {
                            card: card
                        }
                    }).then(function (paymentIntentResult) {
                        if (paymentIntentResult.error) {
                            jQuery('.overlay').addClass('hidden');
                            var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>' + paymentIntentResult.error.message + '</div>';
                            jQuery('.alert_message').html(error_html);
                            jQuery(form).find('.color-blue').removeAttr("disabled").button('refresh');
                        } else {
                            jQuery('.alert_message').html('');
                            if (paymentIntentResult.paymentIntent.status === 'succeeded') {
                                stripe_token_card(paymentIntentResult.paymentIntent);
                            }
                        }
                    });
                });
            }
            else {
                var newsletterSubscription = 0;
                if (jQuery('#newsletter_subscription').prop("checked") === true) {
                    newsletterSubscription = 1;
                }
                var fd = new FormData();
                fd.append('action', 'get_total_cart_price');
                fd.append('type', 'pay_card');
                fd.append('newsletter_subscription', newsletterSubscription);
                jQuery.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: fd,
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    complete: function (data) {
                        if (typeof data.responseJSON.error !== 'undefined') {
                            var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>' + data.responseJSON.error + '</div>';
                            jQuery('.alert_message').html(error_html);
                            jQuery('.overlay').addClass('hidden');
                        } else {
                            jQuery('.overlay').removeClass('hidden');
                            stripeSourceId = data.responseJSON.source_id;
                            stripeSourceRedirectUrl = data.responseJSON.redirect_url;
                            var fd = new FormData();
                            fd.append("source_id", stripeSourceId);
                            fd.append('action', 'set_booking_source');
                            jQuery.ajax({
                                type: 'POST',
                                url: ajaxurl,
                                data: fd,
                                contentType: false,
                                processData: false,
                                dataType: 'json',
                                complete: function (data) {
                                    if (data.responseJSON.status === 1) {
                                        jQuery('.overlay').addClass('hidden');
                                        stripeSourceHandler(stripeSourceRedirectUrl);
                                    } else {
                                        var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>' + data.responseJSON.message + '</div>';
                                        jQuery('.alert_message').html(error_html);
                                        jQuery('.overlay').addClass('hidden');
                                    }
                                }
                            });
                            window.location = data.responseJSON.redirect_url
                        }
                    }
                });
            }
        }
        jQuery('.overlay').addClass('hidden');
    });
    jQuery('.pay_ideal').click(function () {
        jQuery('.alert_message').html('');
        if (jQuery('#privacy_policy').prop("checked") === false) {
            var fd = new FormData();
            fd.append('action', 'get_privacy_policy_error');
            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                data: fd,
                contentType: false,
                processData: false,
                dataType: 'json',
                complete: function (data) {
                    if (data.responseJSON.status) {
                        var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>' + data.responseJSON.message + '</div>';
                        jQuery('.alert_message').html(error_html);
                    }
                }
            });
        } else {
            if (payment_method == "stripe") {
                jQuery('.overlay').removeClass('hidden');
                jQuery('.checkout_form').addClass('hidden');
                jQuery('.payment_form_ideal').removeClass('hidden');
                var stripe = Stripe(key);
                var elements = stripe.elements();
                var options = {
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#32325d',
                            padding: '10px 12px'
                        }
                    }
                };
                var idealBank = elements.create('idealBank', options);
                idealBank.mount('#ideal-bank-element');
                var form = document.getElementById('payment-form-ideal');
                var bank = '';
                idealBank.on('change', function (event) {
                    bank = event.value;
                });
                var newsletterSubscription = 0;
                if (jQuery('#newsletter_subscription').prop("checked") === true) {
                    newsletterSubscription = 1;
                }
                form.addEventListener('submit', function (event) {
                    jQuery('.overlay').removeClass('hidden');
                    event.preventDefault();
                    var fd = new FormData();
                    var stripeSourceId = '';
                    var stripeSourceRedirectUrl = '';
                    fd.append('action', 'get_total_cart_price');
                    fd.append('type', 'pay_ideal');
                    fd.append('bank', bank);

                    fd.append('newsletter_subscription', newsletterSubscription);
                    jQuery.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        data: fd,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        complete: function (data) {
                            if (typeof data.responseJSON.error !== 'undefined') {
                                var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>' + data.responseJSON.error + '</div>';
                                jQuery('.alert_message').html(error_html);
                                jQuery('.overlay').addClass('hidden');
                            } else {
                                jQuery('.alert_message').html('');
                                stripeSourceId = data.responseJSON.source_id;
                                stripeSourceRedirectUrl = data.responseJSON.redirect_url;
                                var fd = new FormData();
                                fd.append("source_id", stripeSourceId);
                                fd.append('action', 'set_booking_source');
                                jQuery.ajax({
                                    type: 'POST',
                                    url: ajaxurl,
                                    data: fd,
                                    contentType: false,
                                    processData: false,
                                    dataType: 'json',
                                    complete: function (data) {
                                        jQuery('.submit_btn_ideal').removeClass('clicked_element');
                                        if (data.responseJSON.status === 1) {
                                            jQuery('.overlay').addClass('hidden');
                                            stripeSourceHandler(stripeSourceRedirectUrl);
                                        } else {
                                            var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>' + data.responseJSON.message + '</div>';
                                            jQuery('.alert_message').html(error_html);
                                            jQuery('.overlay').addClass('hidden');
                                        }
                                    }
                                });
                            }
                        }
                    });
                });
            }
            else {
                jQuery(".overlay").removeClass("hidden");
                jQuery(".checkout_form").addClass("hidden");
                jQuery(".payment_form_ideal").removeClass("hidden");
                var form = document.getElementById('payment-form-ideal');
                var bank = "";
                form.addEventListener("submit", function (event) {
                    jQuery(".overlay").removeClass("hidden");
                    event.preventDefault();
                    var fd = new FormData();
                    var stripeSourceId = "";
                    var stripeSourceRedirectUrl = "";
                    var bank = jQuery("#ideal-bank-element").find("select").val();
                    if (bank.length === 0) {
                        jQuery(".choose-bank-error").removeClass("hide");
                        jQuery(".overlay").addClass("hidden");
                        return false;
                    }
                    fd.append("action", "get_total_cart_price");
                    fd.append("type", "pay_ideal");
                    fd.append("bank", bank);
                    fd.append('newsletter_subscription', newsletterSubscription);
                    jQuery.ajax({
                        type: "POST",
                        url: ajaxurl,
                        data: fd,
                        contentType: false,
                        processData: false,
                        dataType: "json",
                        complete: function (data) {
                            // console.log(data);
                            // if(!data.responseJSON.status){
                            //   jQuery(".alert_message").html(data.responseJSON.message);
                            //   jQuery(".overlay").addClass("hidden");
                            // }
                            if (typeof data.responseJSON.error !== "undefined") {
                                var error_html =
                                    '<div class="alert alert-danger alert-dismissible" id="error-msg"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>' +
                                    data.responseJSON.error +
                                    "</div>";
                                jQuery(".alert_message").html(error_html);
                                jQuery(".overlay").addClass("hidden");
                                setTimeout(function () { jQuery(".alert_message").fadeOut(1500); }, 5000)
                            } else {
                                jQuery(".overlay").removeClass("hidden");
                                stripeSourceId = data.responseJSON.source_id;
                                stripeSourceRedirectUrl = data.responseJSON.redirect_url;
                                var fd = new FormData();
                                fd.append("source_id", stripeSourceId);
                                fd.append('action', 'set_booking_source');
                                jQuery.ajax({
                                    type: 'POST',
                                    url: ajaxurl,
                                    data: fd,
                                    contentType: false,
                                    processData: false,
                                    dataType: 'json',
                                    complete: function (data) {
                                        jQuery('.submit_btn_ideal').removeClass('clicked_element');
                                        if (data.responseJSON.status === 1) {
                                            jQuery('.overlay').addClass('hidden');
                                            stripeSourceHandler(stripeSourceRedirectUrl);
                                        } else {
                                            var error_html = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>' + data.responseJSON.message + '</div>';
                                            jQuery('.alert_message').html(error_html);
                                            jQuery('.overlay').addClass('hidden');
                                        }
                                    }
                                });
                                window.location = data.responseJSON.redirect_url;
                            }
                        },
                    });
                });
            }
            jQuery('.overlay').addClass('hidden');
        }
    });
})
function resetAllValues() {
    $('.parking_ticket_details').find('input').val('')
    $('input:not(.event_ticket_price)').val('');
    $('input:not(.day_vehicle_price)').val('')
}
function reset_payment_form() {
    jQuery('.parking_ticket_details').addClass('hidden')
    jQuery('.booking_detail_form').addClass('hidden')
    jQuery('.checkout_form').addClass('hidden')
    jQuery('.event_ticket_listing').addClass('hidden')
    jQuery('.header-section').removeClass('invisible')
    jQuery('.cart-details').css({ display: "none" });
    jQuery('.step1').removeClass('hidden')
    jQuery('.booking_detail_form #booking_date').removeClass('hidden')
    jQuery('.booking_detail_form #booking_qty').removeClass('hidden')
    jQuery('.booking_detail_form #booking_vehicle_num').removeClass('hidden')
    jQuery('.booking_detail_form #booking_username').removeClass('hidden')
    jQuery('.booking_detail_form #booking_dob').removeClass('hidden')
    resetAllValues()
}
function checkout_page() {
    var fd = new FormData()
    fd.append('action', 'get_checkout_html')
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: fd,
        contentType: false,
        processData: false,
        dataType: 'json',
        complete: function (data) {
            jQuery('.checkout_form_content').html(data.responseJSON.html)
            jQuery('.cart-details').html(data.responseJSON.cart_html)
            jQuery('.items_count_con').html(data.responseJSON.cart_count)
            reset_payment_form()
            jQuery('.btn-checkout-popup').click(function () {
                checkout_page()
            })
            jQuery('.remove_cart_item').click(function () {
                var key_item = jQuery(this).attr('data-key')
                remove_cart_item(key_item)
            })
            jQuery('.step1').addClass('hidden')
            jQuery('.checkout_form').removeClass('hidden')
            jQuery('.header-section').addClass('invisible')
        }
    })
    jQuery('.parking_ticket_details').addClass('hidden')
    jQuery('.booking_detail_form').addClass('hidden')
}
function get_booked_dates(start, end, type) {
    var fd = new FormData()
    var start_date = start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate()
    var end_date = end.getFullYear() + "-" + (start.getMonth() + 1) + "-" + end.getDate()
    fd.append('start', start_date)
    fd.append('end', end_date)
    fd.append('type', type)
    fd.append('action', 'get_booked_dates')
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: fd,
        contentType: false,
        processData: false,
        dataType: 'json',
        complete: function (response) {
            dateAllowedPicker.datepicker("setDatesDisabled", response.responseJSON.data)
            jQuery('.steps_con').removeClass('loading')
            jQuery('.datepicker .datepicker-days table.table-condensed').removeClass('loading')
        }
    })
}
function remove_cart_item(key) {
    var fd = new FormData()
    fd.append('key_value', key)
    fd.append('action', 'remove_cart_item')
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: fd,
        contentType: false,
        processData: false,
        dataType: 'json',
        complete: function (data) {
            jQuery('.checkout_form_content').html(data.responseJSON.html)
            jQuery('.cart-details').html(data.responseJSON.cart_html)
            jQuery('.items_count_con').html(data.responseJSON.cart_count)
            if (data.responseJSON.cart_count == 0) {
                reset_payment_form()
            }
            jQuery('.btn-checkout-popup').click(function () {
                checkout_page()

            })
            jQuery('.remove_cart_item').click(function () {
                var key_item = jQuery(this).attr('data-key')
                remove_cart_item(key_item)
            })
        }
    })
}
function formatDate(date, eleminator) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

    if (month.length < 2)
        month = '0' + month
    if (day.length < 2)
        day = '0' + day

    return [day, month, year].join(eleminator)
}
function stripeSourceHandler(url) {
    document.location.href = url;
}
function stripe_token_card(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById('payment-form-card');
    var appendUrl = '/charge-card?token=' + token.id;
    jQuery(form).attr('action', appendUrl);
    // Submit the form
    form.submit();
}
function formatAmount(amount) {
    const formated_amount = amount.toLocaleString("nl-NL", { style: "currency", currency: "EUR" })
    console.log(formated_amount)
    return formated_amount;
}

