/**
 * Created by Eric on 12/24/2014.
 */

define(['jquery','underscore', 'backbone'],

    function($, _, Backbone){

        'use strict';

        /**
         * Home Model
         * @constructor
         * @private
         */
        var CompanyModel = Backbone.Model.extend({

            defaults : {
                companyCode: '',
                companyName: '',
                months: []
            },

            flag: false

        });

        return CompanyModel;

    });