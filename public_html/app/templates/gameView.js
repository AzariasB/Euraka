// Data
var config = require( 'data/config.js' );

// Class
var Kaode = require( 'class/kaode.js' );

// Lib
require( 'lib/mousetrap.js' );
var tools = require( 'lib/tools.js' );
var $ = require( 'jquery' );
var _ = require( 'underscore' );
var i18n = require( 'lib/i18n.js' );

// Template
var gameTpl = require( 'templates/game/gameTpl.ract' );
var bibliothequeTpl = require( 'templates/game/bibliothequeTpl.ract' );

class GameView
{
    constructor( game )
    {
        this.game = game;
        this.game.gameView = this;

        tools.fadeOut( 'introPanel' );
        this.ractive = tools.showTemplate( gameTpl, 'l-game',
        {
            "pseudo"       : this.game.joueur.getPseudo(),
            "lvl"          : this.game.joueur.getLvl(),
            "nbRation"     : this.game.joueur.getNbRation(),
            "spriteRation" : this.game.joueur.getSpriteRation(),
            "spriteObjet"  : this.game.joueur.getSpriteObjet(),
            "spriteArme"   : this.game.joueur.getSpriteArme()
        } );

        this.bindGameEvent();

        return;
    }

    handleImgClicked( e )
    {
        e = e || window.event;

        var panel = document.getElementById( 'dockPanel' ),
            img = document.getElementById( 'dock-img' ),
            displayPanel = panel.style.display,
            displayImg = img.style.display,
            eDown = document.createEvent( 'MouseEvents' ),
            eUp = document.createEvent( 'MouseEvents' ),
            behind;

        eDown.initMouseEvent( 'mousedown',
            e.bubbles, e.cancelable, e.view, e.detail,
            e.screenX, e.screenY, e.clientX, e.clientY,
            e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
            e.button, document.body.parentNode );

        eUp.initMouseEvent( 'mouseup',
            e.bubbles, e.cancelable, e.view, e.detail,
            e.screenX, e.screenY, e.clientX, e.clientY,
            e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
            e.button, document.body.parentNode );

        panel.style.display = 'none';
        img.style.display = 'none';

        // get element at point of click
        behind = document.elementFromPoint( e.clientX, e.clientY );

        behind.dispatchEvent( eDown );
        behind.dispatchEvent( eUp );

        // bring back the finger
        panel.style.display = displayPanel;
        img.style.display = displayImg;

        return;
    }

    handleDockClicked( e )
    {
        e = e || window.event;

        var fct = null;

        switch ( e.target.id.toString() )
        {
            case 'dock-ami':
                fct = this.openBibliotheque;
                break;
            case 'dock-journal':
                fct = this.openBibliotheque;
                break;
            case 'dock-bibliotheque':
                fct = this.openBibliotheque;
                break;
            case 'dock-joueur':
                fct = this.openBibliotheque;
                break;
            case 'dock-cristal':
                fct = this.openBibliotheque;
                break;
        }

        fct.bind( this )();

        return;
    }

    /**
     * Bind les clicks du dock
     * Bind le hover du dock
     * Bind les raccourcis clavier
     */
    bindGameEvent()
    {
        // Click sur img
        document.getElementById( 'dock-img' ).addEventListener( 'click', this.handleImgClicked, false );

        // Click du dock
        var fct = this.handleDockClicked.bind( this );
        document.getElementById( 'dock-ami' ).addEventListener( 'click', fct, false );
        document.getElementById( 'dock-journal' ).addEventListener( 'click', fct, false );
        document.getElementById( 'dock-bibliotheque' ).addEventListener( 'click', fct, false );
        document.getElementById( 'dock-joueur' ).addEventListener( 'click', fct, false );
        document.getElementById( 'dock-cristal' ).addEventListener( 'click', fct, false );

        // Hover du dock
        var tabIds = [
            {
                id: 'dock-ami',
                class: 'ui-dock-ami'
        },
            {
                id: 'dock-journal',
                class: 'ui-dock-journal'
        },
            {
                id: 'dock-bibliotheque',
                class: 'ui-dock-bibliotheque'
        },
            {
                id: 'dock-joueur',
                class: 'ui-dock-perso'
        },
            {
                id: 'dock-cristal',
                class: 'ui-dock-cristal'
        } ];

        var img = document.getElementById( 'dock-img' ),
            imgClassList = img.classList,
            dockClass = 'ui-dock',
            el, fctIn, fctOut;

        _.each( tabIds, function( item )
        {
            el = document.getElementById( item.id );

            fctIn = function()
            {
                imgClassList.add( item.class );
                imgClassList.remove( dockClass );
            };

            fctOut = function()
            {
                imgClassList.add( dockClass );
                imgClassList.remove( item.class );
            };

            el.addEventListener( 'mouseenter', fctIn, false );
            el.addEventListener( 'mouseenter', fctIn, false );
            el.addEventListener( 'mouseout', fctOut, false );
            el.addEventListener( 'mouseleave', fctOut, false );
        } );

        // Keyboard binding
        Mousetrap.bind( 'esc', this.handleEsc.bind( this ), 'keyup' );
        Mousetrap.bind( 'a', this.handleA.bind( this ), 'keyup' );

        return;
    }

    handleEsc()
    {
        console.log( 'Escape' );
    }

    handleA()
    {
        if ( this.game.gamePresenter.canChangeItem() === false )
        {
            return;
        }

        return this.game.joueur.equip( this.game.joueur.keyBinding.a );
    }

    openMenu()
    {
        tools.addOverlay( null,
        {
            "opacity": 0.5
        } );

        return;
    }

    openBibliotheque()
    {
        this.openMenu();

        tools.showTemplate( bibliothequeTpl, 'popin',
        {
            terrains: ['plaine', 'foret', 'ile', 'marais', 'montagne'],
            sousTerrains: ['desert', 'espace', 'glace', 'jungle', 'ville'],
            hasCommutateur: false,
            currentElement: 'jungle',
            currentElementPanel: 'jungle',
            titre: i18n.t( 'uibibliothequetitre' ),
            desc: i18n.t( 'uibibliothequedescription' ),
            kaodesInCristal: this.game.voyageur.getCristal(),
            kaodesInBibliotheque: this.game.voyageur.getBibliotheque(),
        } );

        tools.addScrollbar( 'bibliotheque-panel' );
        tools.addScrollbar( 'bibliotheque-desc' );

        tools.addClick( 'bibliotheque-close-btn', this.closeMenu.bind( this ) );
        tools.addOver('bibliotheque-close-btn', 'close', 'close-over');

        return;
    }

    closeMenu()
    {
        tools.fadeOut('popin', tools.removeOverlay);
    }

}

module.exports = GameView;