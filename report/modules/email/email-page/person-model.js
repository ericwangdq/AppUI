/**
 * Created by Eric on 1/20/2015.
 */
define(['jquery','underscore', 'backbone',  'base/eiinfo', 'services/agent'],

    function($, _, Backbone, Eiinfo, Agent){

        'use strict';

        /**
         * Home Model
         * @constructor
         * @private
         */
        var ContactModel = Backbone.Model.extend({

            defaults : {
                coguPosition: '',
                coguGuid: '',
                coguName: '',
                coguCode: '',
                isFriend: '',
                coguPinyincn: '',
                coguPycn: ''
            },

            initialize: function(){

                var me = this;

            },

            flag: false


        });

        return ContactModel;

    });