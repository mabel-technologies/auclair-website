/*
 * Hand-built from blocks/quick-help-chips/index.tsx — this box has no Node toolchain.
 * `npm run build` regenerates an equivalent bundle; keep the TSX as source of truth.
 */
( function () {
	'use strict';

	var el = wp.element.createElement;
	var Fragment = wp.element.Fragment;
	var useState = wp.element.useState;
	var useEffect = wp.element.useEffect;
	var registerBlockType = wp.blocks.registerBlockType;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var PanelBody = wp.components.PanelBody;
	var BaseControl = wp.components.BaseControl;
	var Button = wp.components.Button;
	var Spinner = wp.components.Spinner;
	var TextControl = wp.components.TextControl;
	var SelectControl = wp.components.SelectControl;
	var RangeControl = wp.components.RangeControl;
	var ServerSideRender = wp.serverSideRender;
	var apiFetch = wp.apiFetch;
	var addQueryArgs = wp.url.addQueryArgs;
	var decodeEntities = wp.htmlEntities.decodeEntities;
	var __ = wp.i18n.__;
	var metadata = {"name": "auclair/quick-help-chips"};

	/* Shared ArticlePicker (blocks/shared/ArticlePicker.tsx), hand-built. */
	var fetchArticles = function ( query ) {
		query._fields = 'id,title';
		return apiFetch( { path: addQueryArgs( '/wp/v2/kb_article', query ) } );
	};

	var ArticlePicker = function ( props ) {
		var value = props.value || [];
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

		var unpicked = matches.filter( function ( a ) { return value.indexOf( a.id ) === -1; } );

		return el( BaseControl, { label: __( 'Articles (optional)', 'auclair' ), help: props.help, __nextHasNoMarginBottom: true },
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

	var SOURCES = [
		{ label: __( 'Most viewed', 'auclair' ), value: 'popular' },
		{ label: __( 'Help tags', 'auclair' ), value: 'term' },
		{ label: __( 'Manual', 'auclair' ), value: 'manual' },
	];

	registerBlockType( metadata.name, {
		edit: function ( props ) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var source = attributes.source;
			var posts = attributes.posts || [];
			var blockProps = useBlockProps();

			return el( Fragment, null,
				el( InspectorControls, null,
					el( PanelBody, { title: __( 'Settings', 'auclair' ) },
						el( TextControl, {
							label: __( 'Label', 'auclair' ),
							value: attributes.label,
							onChange: function ( label ) { setAttributes( { label: label } ); },
						} ),
						el( SelectControl, {
							label: __( 'Source', 'auclair' ),
							value: source,
							options: SOURCES,
							onChange: function ( source ) { setAttributes( { source: source } ); },
						} ),
						el( RangeControl, {
							label: __( 'Number of chips', 'auclair' ),
							value: attributes.limit,
							min: 1,
							max: 8,
							onChange: function ( limit ) { setAttributes( { limit: limit || 4 } ); },
						} ),
						el( ArticlePicker, {
							value: posts,
							onChange: function ( posts ) { setAttributes( { posts: posts } ); },
							help: 'manual' === source
								? __( 'Only these articles are shown.', 'auclair' )
								: __( 'Shown first; the source above fills the remaining chips.', 'auclair' ),
						} )
					)
				),
				el( 'div', blockProps,
					el( ServerSideRender, { block: metadata.name, attributes: attributes } )
				)
			);
		},
		save: function () { return null; },
	} );
} )();
