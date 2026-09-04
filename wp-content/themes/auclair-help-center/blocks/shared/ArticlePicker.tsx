import { BaseControl, Button, TextControl, Spinner } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';

type Article = { id: number; title: { rendered: string } };

const fetchArticles = ( query: Record< string, unknown > ) =>
	apiFetch< Article[] >( {
		path: addQueryArgs( '/wp/v2/kb_article', { ...query, _fields: 'id,title' } ),
	} );

/**
 * Optional hand-picked `kb_article` selection, stored as post IDs in the order
 * chosen. Deliberately built on plain controls + apiFetch: FormTokenField
 * crashed the editor canvas on unrelated attribute changes.
 */
export default function ArticlePicker( {
	value,
	onChange,
	help,
	label,
	exclude = [],
}: {
	value: number[];
	onChange: ( ids: number[] ) => void;
	help?: string;
	label?: string;
	exclude?: number[];
} ) {
	const [ search, setSearch ] = useState( '' );
	const [ matches, setMatches ] = useState< Article[] >( [] );
	const [ titles, setTitles ] = useState< Record< number, string > >( {} );
	const [ loading, setLoading ] = useState( false );

	// Titles for the selected IDs (only the ones we don't know yet).
	useEffect( () => {
		const missing = value.filter( ( id ) => ! titles[ id ] );
		if ( ! missing.length ) {
			return;
		}
		fetchArticles( { include: missing, per_page: missing.length } ).then( ( found ) => {
			setTitles( ( prev ) => {
				const next = { ...prev };
				found.forEach( ( a ) => ( next[ a.id ] = decodeEntities( a.title.rendered ) ) );
				return next;
			} );
		} );
	}, [ value ] );

	// Debounced title search.
	useEffect( () => {
		if ( ! search.trim() ) {
			setMatches( [] );
			return;
		}
		let cancelled = false;
		setLoading( true );
		const timer = setTimeout( () => {
			fetchArticles( { search, per_page: 10 } )
				.then( ( found ) => {
					if ( ! cancelled ) {
						setMatches( found );
					}
				} )
				.finally( () => ! cancelled && setLoading( false ) );
		}, 250 );
		return () => {
			cancelled = true;
			clearTimeout( timer );
		};
	}, [ search ] );

	const hidden = ( a: Article ) => value.includes( a.id ) || exclude.includes( a.id );

	const add = ( a: Article ) => {
		setTitles( ( prev ) => ( { ...prev, [ a.id ]: decodeEntities( a.title.rendered ) } ) );
		onChange( [ ...value, a.id ] );
		setSearch( '' );
	};

	return (
		<BaseControl label={ label ?? __( 'Articles (optional)', 'auclair' ) } help={ help } __nextHasNoMarginBottom>
			{ value.length > 0 && (
				<ul className="auclair-article-picker__selected">
					{ value.map( ( id ) => (
						<li key={ id }>
							<span>{ titles[ id ] || `#${ id }` }</span>
							<Button
								size="small"
								variant="tertiary"
								label={ __( 'Remove', 'auclair' ) }
								onClick={ () => onChange( value.filter( ( v ) => v !== id ) ) }
							>
								×
							</Button>
						</li>
					) ) }
				</ul>
			) }
			<TextControl
				placeholder={ __( 'Search articles…', 'auclair' ) }
				value={ search }
				onChange={ setSearch }
				__nextHasNoMarginBottom
			/>
			{ loading && <Spinner /> }
			{ matches.filter( ( a ) => ! hidden( a ) ).length > 0 && (
				<ul className="auclair-article-picker__results">
					{ matches
						.filter( ( a ) => ! hidden( a ) )
						.map( ( a ) => (
							<li key={ a.id }>
								<Button variant="link" onClick={ () => add( a ) }>
									{ decodeEntities( a.title.rendered ) }
								</Button>
							</li>
						) ) }
				</ul>
			) }
		</BaseControl>
	);
}
