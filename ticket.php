<?php
class Tickets
{
    public $products;
    public function __construct($products)
    {
        $this->products = $products;
        $this->tickets($this->products);
    }
    private function tickets($products)
    {
        $lang = new Language();
?>
        <div class="parking_ticket_form">
            <input type="hidden" id="ticket_type" />
            <!-- Day Ticket Person -->
            <div class="parking_ticket_details hidden" id="day_ticket_person">
                <div class="parking_ticket_details_form_alert hidden">
                    <p><?php echo $lang->get_language_string_ps('already_at_location_warning') ?></p>
                    <div class="form-group text-center">
                        <button class="btn btn-alert-no col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('no') ?></button>
                        <button class="btn btn-alert-yes color-blue col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('yes') ?></button>
                    </div>
                </div>
                <?php if (is_array($products) && array_key_exists('person_ticket', $products)) { ?>
                    <div class="form-group">
                        <label for="usr"><?php echo $lang->get_language_string_ps('amount') ?></label>
                        <input type="text" class="form-control day_person_price" id="day_person_price" readonly="">
                    </div>
                    <input type="hidden" class="product_id" id="product_id">
                    <input type="hidden" class="product_name" id="product_name" value="">
                    <input type="hidden" class="hidden_amount" name="hidden_amount" id="hidden_amount">
                <?php } ?>
                <div class="form-group">
                    <label for="booking_email"><?php echo $lang->get_language_string_ps('email') ?></label>
                    <input type="email" class="form-control booking_email" placeholder="<?php echo $lang->get_language_string_ps('email') ?>" id="booking_email" name="booking_email">
                </div>
                <div class="form-group">
                    <label for="usr"><?php echo $lang->get_language_string_ps('date') ?></label>
                    <input type="text" class="form-control booking_date date_allowed" placeholder="" id="booking_date" name="booking_date">
                </div>
                <div class="form-group">
                    <label for="usr"><?php echo $lang->get_language_string_ps('quantity') ?></label>
                    <input type="number" class="form-control booking_quantity" min="1"id="booking_quantity" name="booking_quantity" placeholder="<?php echo $lang->get_language_string_ps('quantity') ?>" value="1" id="booking_quantity" name="booking_quantity">
                </div>
                <div class="form-group text-center">
                    <button class="btn step_back col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('back') ?></button>
                    <button class="btn booking_details_form_submit color-blue col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('next') ?></button>
                </div>
            </div>
            <!-- Day Ticket vehicle -->
            <div class="parking_ticket_details hidden" id="day_ticket_vehicle">
                <div class="parking_ticket_details_form_alert hidden">
                    <p><?php echo $lang->get_language_string_ps('already_at_location_warning') ?></p>
                    <div class="form-group text-center">
                        <button class="btn btn-alert-no col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('no') ?></button>
                        <button class="btn btn-alert-yes color-blue col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('yes') ?></button>
                    </div>
                </div>
                <?php if (is_array($products) && array_key_exists('day_ticket', $products)) { ?>
                    <div class="form-group">
                        <label for="usr"><?php echo $lang->get_language_string_ps('amount') ?></label>
                        <input type="text" class="form-control day_vehicle_price" id="day_vehicle_price" readonly="">
                    </div>
                <?php } ?>
                <input type="hidden" class="product_id" id="product_id">
                <input type="hidden" class="product_name" id="product_name" value="">
                <input type="hidden" class="hidden_amount" name="hidden_amount" id="hidden_amount">
                <div class="form-group">
                    <label for="booking_email"><?php echo $lang->get_language_string_ps('email') ?></label>
                    <input type="email" class="form-control booking_email" placeholder="<?php echo $lang->get_language_string_ps('email') ?>" id="booking_email" name="booking_email">
                </div>
                <div class="form-group">
                    <label for="usr"><?php echo $lang->get_language_string_ps('date') ?></label>
                    <input type="text" class="form-control booking_date date_allowed" placeholder="" id="booking_date" name="booking_date">
                </div>
                <div class="form-group">
                    <label for="usr"><?php echo $lang->get_language_string_ps('plate_number') ?></label>
                    <input type="text" class="form-control vehicle_num" placeholder="<?php echo $lang->get_language_string_ps('plate_number') ?>" id="vehicle_num" name="vehicle_num">
                </div>
                <div class="form-group text-center">
                    <button class="btn step_back col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('back') ?></button>
                    <button class="btn booking_details_form_submit color-blue col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('next') ?></button>
                </div>
            </div>
            <!-- Hourly Ticket Vehicle -->
            <div class="parking_ticket_details hidden" id="hourly_ticket_vehicle">
                <div class="form-group">
                    <label class="text-left"><?php echo $lang->get_language_string_ps('receipt_text') ?></label>
                </div>
                <div class="form-group">
                    <label for="booking_email"><?php echo $lang->get_language_string_ps('email') ?></label>
                    <input type="email" class="form-control booking_email" placeholder="<?php echo $lang->get_language_string_ps('email') ?>" id="booking_email" name="booking_email">
                </div>
                <div class="form-group">
                    <label class="text-left"><?php echo $lang->get_language_string_ps('plate_number_hourly') ?></label>
                    <input type="text" class="form-control vehicle_num" placeholder="<?php echo $lang->get_language_string_ps('plate_number') ?>" id="vehicle_num" name="vehicle_num">
                </div>
                <div class="form-group text-center">
                    <button class="btn step_back col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('back') ?></button>
                    <button class="btn booking_details_form_submit color-blue col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('next') ?></button>
                </div>
            </div>
            <!-- Yearly Ticket Vehicle -->
            <div class="parking_ticket_details hidden" id="yearly_ticket_vehicle">
                <div class="parking_ticket_details_form_alert hidden">
                    <p><?php echo $lang->get_language_string_ps('already_at_location_warning') ?></p>
                    <div class="form-group text-center">
                        <button class="btn btn-alert-no col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('no') ?></button>
                        <button class="btn btn-alert-yes color-blue col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('yes') ?></button>
                    </div>
                </div>
                <div class="form-group">
                    <label for="booking_user_name"><?php echo $lang->get_language_string_ps('user_name') ?></label>
                    <input type="text" class="form-control booking_user_name" placeholder="<?php echo $lang->get_language_string_ps('user_name') ?>" id="booking_user_name" name="booking_user_name">
                </div>
                <?php if (is_array($products) && array_key_exists('year_ticket_vehicle', $products)) { ?>
                    <div class="form-group">
                        <label for="usr"><?php echo $lang->get_language_string_ps('amount') ?></label>
                        <input type="text" class="form-control yearly_vehicle_price" id="yearly_vehicle_price" readonly="">
                    </div>
                    <input type="hidden" class="product_id" id="product_id">
                    <input type="hidden" class="product_name" id="product_name" value="">
                    <input type="hidden" class="hidden_amount" name="hidden_amount" id="hidden_amount">
                <?php } ?>
                <div class="form-group">
                    <label for="booking_email"><?php echo $lang->get_language_string_ps('email') ?></label>
                    <input type="email" class="form-control booking_email" placeholder="<?php echo $lang->get_language_string_ps('email') ?>" id="booking_email" name="booking_email">
                </div>
                <div class="form-group">
                    <label for="usr"><?php echo $lang->get_language_string_ps('plate_number') ?></label>
                    <input type="text" class="form-control vehicle_num" placeholder="<?php echo $lang->get_language_string_ps('plate_number') ?>" id="vehicle_num" name="vehicle_num">
                </div>
                <div class="form-group text-center">
                    <button class="btn step_back col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('back') ?></button>
                    <button class="btn booking_details_form_submit color-blue col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('next') ?></button>
                </div>
            </div>
            <!-- Yearly Ticket Person -->
            <div class="parking_ticket_details hidden" id="yearly_ticket_person">
                <div class="parking_ticket_details_form_alert hidden">
                    <p><?php echo $lang->get_language_string_ps('already_at_location_warning') ?></p>
                    <div class="form-group text-center">
                        <button class="btn btn-alert-no col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('no') ?></button>
                        <button class="btn btn-alert-yes color-blue col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('yes') ?></button>
                    </div>
                </div>
                <div class="form-group">
                    <label for="booking_user_name"><?php echo $lang->get_language_string_ps('user_name') ?>*</label>
                    <input type="text" class="form-control booking_user_name" placeholder="<?php echo $lang->get_language_string_ps('user_name') ?>" id="booking_user_name" name="booking_user_name">
                </div>
                <?php if (is_array($products) && array_key_exists('year_ticket_vehicle', $products)) { ?>
                    <div class="form-group">
                        <label for="usr"><?php echo $lang->get_language_string_ps('amount') ?></label>
                        <input type="text" class="form-control yearly_person_price" id="yearly_person_price" readonly="">
                    </div>
                    <input type="hidden" class="product_id" id="product_id">
                    <input type="hidden" class="product_name" id="product_name" value="">
                    <input type="hidden" class="hidden_amount" name="hidden_amount" id="hidden_amount">
                <?php } ?>
                <div class="form-group">
                    <label for="booking_email"><?php echo $lang->get_language_string_ps('email') ?></label>
                    <input type="email" class="form-control booking_email" placeholder="<?php echo $lang->get_language_string_ps('email') ?>" id="booking_email" name="booking_email">
                </div>
                <div class="form-group">
                    <label for="usr"><?php echo $lang->get_language_string_ps('dob') ?>*</label>
                    <input type="text" class="form-control booking_dob " placeholder="" id="booking_dob" name="booking_dob">
                </div>
                <div class="form-group text-center">
                    <button class="btn step_back col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('back') ?></button>
                    <button class="btn booking_details_form_submit color-blue col-sm-6 col-xs-6"><?php echo $lang->get_language_string_ps('next') ?></button>
                </div>
            </div>

        </div>
        <div class="booking_detail_form hidden" id="booking_detail_form">
            <div class="form-group col-md-12 label-display-parent text-center" id="booking_username">
                <input type="hidden" name="booking_detail_user_name" id="booking_detail_user_name">
                <label class="col-sm-6 col-xs-6 colo-black"><b><?php echo $lang->get_language_string_ps('user_name') ?>:</b></label>
                <label class="col-sm-6 col-xs-6 colo-black label_user_name"></label>
            </div>
            <div class="form-group col-md-12 label-display-parent text-center" id="booking_amount">
                <input type="hidden" name="booking_detail_amount" id="booking_detail_amount">
                <label class="col-sm-6 col-xs-6  colo-black"><b><?php echo $lang->get_language_string_ps('amount') ?>:</b></label>
                <label class="col-sm-6 col-xs-6  colo-black label_amount"></label>
            </div>
            <div class="form-group col-md-12 label-display-parent text-center" id="booking_email">
                <input type="hidden" name="booking_detail_email" id="booking_detail_email">
                <label class="col-sm-6 col-xs-6  colo-black"><b><?php echo $lang->get_language_string_ps('email') ?>:</b></label>
                <label class="col-sm-6 col-xs-6  colo-black label_booking_email"></label>
            </div>
            <div class="form-group col-md-12 label-display-parent text-center" id="booking_date">
                <input type="hidden" name="booking_detail_date" id="booking_detail_date">
                <label class="col-sm-6 col-xs-6  colo-black"><b><?php echo $lang->get_language_string_ps('date') ?>:</b></label>
                <label class="col-sm-6 col-xs-6  colo-black label_booking_date"></label>
            </div>
            <div class="form-group col-md-12 label-display-parent text-center" id="booking_vehicle_num">
                <input type="hidden" name="booking_detail_vehicle_num" id="booking_detail_vehicle_num">
                <label class="col-sm-6 col-xs-6 colo-black"><b><?php echo $lang->get_language_string_ps('plate_number') ?>:</b></label>
                <label class="col-sm-6 col-xs-6 colo-black label_vehicle"></label>
            </div>
            <div class="form-group col-md-12 label-display-parent text-center" id="booking_qty">
                <input type="hidden" name="booking_detail_quantity" id="booking_detail_quantity">
                <label class="col-sm-6 col-xs-6 colo-black"><b><?php echo $lang->get_language_string_ps('quantity') ?>:</b></label>
                <label class="col-sm-6 col-xs-6 colo-black label_booking_quantity"></label>
            </div>
            <div class="form-group col-md-12 label-display-parent text-center" id="booking_dob">
                <input type="hidden" name="booking_detail_dob" id="booking_detail_dob">
                <label class="col-sm-6 col-xs-6 colo-black"><b><?php echo $lang->get_language_string_ps('dob') ?>:</b></label>
                <label class="col-sm-6 col-xs-6 colo-black label_dob"></label>
            </div>
            <div class="form-group text-center">
                <input type="hidden" id="hidden_booking" />
                <button class="btn step_back col-md-4 col-sm-12 col-xs-12"><?php echo $lang->get_language_string_ps('cancel') ?></button>
                <button class="btn add_to_cart col-sm-12 col-md-4 color-blue col-xs-12" id="add_to_cart_day_ticket_vehicle"><?php echo $lang->get_language_string_ps('add_to_cart') ?></button>
                <button class="btn show_details_confirm  col-sm-12 col-xs-12 col-md-4" id="day_ticket_vehicle_details_confirm"><?php echo $lang->get_language_string_ps('checkout') ?></button>
            </div>
        </div>


<?php

    }
}

?>