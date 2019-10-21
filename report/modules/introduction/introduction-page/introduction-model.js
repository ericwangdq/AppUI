

define(['jquery','underscore', 'backbone'],

    function($, _, Backbone){

        'use strict';

        /**
         * Model
         * @constructor
         * @private
         */
        var IntroductionModel = Backbone.Model.extend({

            defaults : {


            },

            flag: false

        });

        return IntroductionModel;

    });