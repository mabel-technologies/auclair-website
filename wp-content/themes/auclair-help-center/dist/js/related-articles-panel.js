/*
 * Hand-built from assets/js/related-articles-panel/index.tsx — this box has no
 * Node toolchain. `npm run build` regenerates an equivalent bundle.
 */
( function () {
	'use strict';

	var el = wp.element.createElement;
	var useState = wp.element.useState;
	var useEffect = wp.element.useEffect;
	var BaseControl = wp.components.BaseControl;
	var Button = wp.components.Button;
	var Spinner = wp.components.Spinner;
	var TextControl = wp.components.TextControl;
	var apiFetch = wp.apiFetch;
	var addQueryArgs = wp.url.addQueryArgs;
	var decodeEntities = wp.htmlEntities.decodeEntities;
	var registerPlugin = wp.plugins.registerPlugin;
	var PluginDocumentSettingPanel = wp.editor.PluginDocumentSettingPanel;
	var useEntityProp = wp.coreData.useEntityProp;
	var useSelect = wp.data.useSelect;
	var __ = wp.i18n.__;

	/* Shared ArticlePicker (blocks/shared/ArticlePicker.tsx), hand-built. */
	var fetchArticles = function ( query ) {
		query._fields = 'id,title';
		return apiFetch( { path: addQueryArgs( '/wp/v2/kb_article', query ) } );
	};

	var ArticlePicker = function ( props ) {
		var value = props.value || [];
		var exclude = props.exclude || [];
		var s1 = useState( '' ), search = s1[ 0 ], setSearch = s1[ 1 ];
		var s2 = useState( [] ), matches = s2[ 0 ], setMatches = s2[ 1 ];
		var s3 = useState( {} ), titles = s3[ 0 ], setTitles = s3[ 1 ];
		var s4 = useState( false ), loading = s4[ 0 ], setLoading = s4[ 1 ];

		useEffect( function () {
			var missing = value.filter( function ( id ) { return ! titles[ id ]; } );
			if ( ! missing.length ) { return; }
			fetchArticles( { include: missing, per_page: missing.length } ).then( function ( found ) {
				setTitles( function ( prev ) {
					var next = Object.assign( {}, prev );
					found.forEach( function ( a ) { next[ a.id ] = decodeEntities( a.title.rendered ); } );
					return next;
				} );
			} );
		}, [ value ] );

		useEffect( function () {
			if ( ! search.trim() ) { setMatches( [] ); return; }
			var cancelled = false;
			setLoading( true );
			var timer = setTimeout( function () {
				fetchArticles( { search: search, per_page: 10 } )
					.then( function ( found ) { if ( ! cancelled ) { setMatches( found ); } } )
					.finally( function () { if ( ! cancelled ) { setLoading( false ); } } );
			}, 250 );
			return function () { cancelled = true; clearTimeout( timer ); };
		}, [ search ] );

		var add = function ( a ) {
			setTitles( function ( prev ) { var n = Object.assign( {}, prev ); n[ a.id ] = decodeEntities( a.title.rendered ); return n; } );
			props.onChange( value.concat( [ a.id ] ) );
			setSearch( '' );
		};

		var unpicked = matches.filter( function ( a ) { return value.indexOf( a.id ) === -1 && exclude.indexOf( a.id ) === -1; } );

		return el( BaseControl, { label: props.label || __( 'Articles (optional)', 'auclair' ), help: props.help, __nextHasNoMarginBottom: true },
			value.length > 0 && el( 'ul', { className: 'auclair-article-picker__selected' },
				value.map( function ( id ) {
					return el( 'li', { key: id },
						el( 'span', null, titles[ id ] || ( '#' + id ) ),
						el( Button, {
							size: 'small',
							variant: 'tertiary',
							label: __( 'Remove', 'auclair' ),
							onClick: function () { props.onChange( value.filter( function ( v ) { return v !== id; } ) ); },
						}, '×' )
					);
				} )
			),
			el( TextControl, {
				placeholder: __( 'Search articles…', 'auclair' ),
				value: search,
				onChange: setSearch,
				__nextHasNoMarginBottom: true,
			} ),
			loading && el( Spinner, null ),
			unpicked.length > 0 && el( 'ul', { className: 'auclair-article-picker__results' },
				unpicked.map( function ( a ) {
					return el( 'li', { key: a.id },
						el( Button, { variant: 'link', onClick: function () { add( a ); } }, decodeEntities( a.title.rendered ) )
					);
				} )
			)
		);
	};

	var KB_ARTICLE_POST_TYPE = 'kb_article';

	var RelatedArticlesPanel = function () {
		var current = useSelect( function ( select ) {
			var editor = select( 'core/editor' );
			return { postType: editor.getCurrentPostType(), postId: editor.getCurrentPostId() };
		}, [] );

		var entity = useEntityProp( 'postType', KB_ARTICLE_POST_TYPE, 'meta' );
		var meta = entity[ 0 ] || {};
		var setMeta = entity[ 1 ];

		if ( current.postType !== KB_ARTICLE_POST_TYPE ) {
			return null;
		}

		return el( PluginDocumentSettingPanel, {
			name: 'auclair-related-articles',
			title: __( 'Related queries', 'auclair' ),
			className: 'auclair-related-articles-panel',
		},
			el( ArticlePicker, {
				label: __( 'Related articles', 'auclair' ),
				value: meta.related || [],
				exclude: current.postId ? [ current.postId ] : [],
				onChange: function ( related ) { setMeta( Object.assign( {}, meta, { related: related } ) ); },
				help: __( 'Shown under "Related queries" on this article, in this order. Leave empty to show other articles from the same category.', 'auclair' ),
			} )
		);
	};

	registerPlugin( 'auclair-related-articles-panel', { render: RelatedArticlesPanel } );
} )();
