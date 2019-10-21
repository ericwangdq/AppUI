/**
 * Created by Eric on 9/23/2014.
 */


define(['jquery','underscore', 'backbone',
        'utilities/session',
        'services/agent',
        'config/serverConfig',
        'config/config',
        'utils',
        'directional/directional-page/directional-model',
        'json'],

    function($, _, Backbone,
             Session,
             Agent,
             ServerConfig,
             Config,
             Utils,
             DirectionalModel){

        'use strict';

        /**
         * Collection
         * @constructor
         * @private
         */
        var DirectionalCollection = Backbone.Collection.extend({

            model: DirectionalModel



        });

        return DirectionalCollection;

    });