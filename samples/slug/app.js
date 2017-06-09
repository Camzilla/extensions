const cfExt = window.contentfulExtension || window.contentfulWidget;

cfExt.init(api => {
    const slugField = api.field;

    // if title doesnt exist, fallback to field heading
    const siblingField = api.entry.fields.title || api.entry.fields.heading;
    const currentRegion = api.entry.fields.region;

    const warningMessage = document.getElementById('warningMessage');
    const slug = document.getElementById('slug');
    const slugGenerated = document.getElementById('slugGenerated');
    const makeSlug = document.getElementById('makeSlug');
    const generateSlug = document.getElementById('generateSlug');
    const duplicate = document.getElementById('duplicate');

    const _ = window._;
    const debouncedUpdateStatus = _.debounce(updateStatus, 500);
    const getSlug = window.getSlug;
    const options = {
        custom: {
            "å": "a",
            "Å": "a",
            "ä": "a",
            "Ä": "a",
            "æ": "a",
            "Æ": "a",
            "ö": "o",
            "Ö": "o",
            "ø": "o",
            "Ø": "o"
        }
    }

    const statusElements = {
        error: document.getElementById('error'),
        ok: document.getElementById('ok'),
        loading: document.getElementById('loading')
    }

    // ??
    api.window.startAutoResizer()

    // Populate input with existing field value
    slugGenerated.value = slugField.getValue() || "";

    // Events to generate and make slug
    makeSlug.addEventListener('click', () => manualSlugCreate() );
    generateSlug.addEventListener('click', () => generateSlugFromField() );


    updateStatus(slugField.getValue())

    /**
    * Event to generate slug from field
    * Generatint from title or heading field
    */
    function generateSlugFromField () {
        warningMessage.style.display = "none";

        if(!currentRegion.getValue()){
            warningMessage.style.display = "block";
            warningMessage.innerText = 'Set the country before getting the slug!';
            setStatus('error');

            api.field.setInvalid(true);

            return;

        } else if(!siblingField.getValue()){
            warningMessage.style.display = "block";
            warningMessage.innerText = 'Title or heading is required to get URL!';
            setStatus('error');

            api.field.setInvalid(true);

            return;

        } else {
            slugGenerated.value = getSlug(siblingField.getValue(), options)
            handleSlugChange(slugGenerated.value);
        }
    }

    function manualSlugCreate() {
        warningMessage.style.display = "none";

        if(!currentRegion.getValue()){
            warningMessage.style.display = "block";
            warningMessage.innerText = 'Set the country before setting the slug!';
            setStatus('error');

            api.field.setInvalid(true);

            return;

        } else if(!slug.value){
            warningMessage.style.display = "block";
            warningMessage.innerText = 'Input is required to generate URL!';
            setStatus('error');

            api.field.setInvalid(true);

            return;

        } else {

            slugGenerated.value = getSlug(slug.value, options);
            handleSlugChange(slugGenerated.value);

            slug.value = "";
        }
    }

  /**
   * Handle change of slug value caused by either typing and generating a value
   * or generating from field
   */
    function handleSlugChange (value) {
        warningMessage.style.display = "none";

        setSlug(getSlug(value || ''), options);
    }

    /**
    * Set the input value to 'slug' and update the status by checking for
    * duplicates.
    */
    function setSlug (slug) {
        slugGenerated.value = slug;
        slugField.setValue(slug);
        setStatus('loading');
        debouncedUpdateStatus(slug);
    }

    /**
    * Show inline status icon based on current status
    */
    function updateStatus (slug) {

        getDuplicates(slug)
        .then(function (res) {

            if (res.hasDuplicates && slug) {
                warningMessage.style.display = "block";
                warningMessage.innerText = 'A page with this URL already exists!!!';
                setStatus('error');

                api.field.setInvalid(true);

                duplicate.style.display = "block";

                for(var dup of res.dupliactes) {

                    duplicate.innerHTML += '<li class="duplicate-item"><a href="/spaces/' + dup.sys.space.sys.id  + '/entries/' + dup.sys.id + '" target="_blank">'  +  dup.fields.name['sv-SE'] + ' <i class="fa fa-external-link"></i></a></li>';
                }

            } else if(slug) {
                warningMessage.style.display = "none";
                setStatus('ok');

                api.field.setInvalid(false);
            } else {
                console.log("Something went wrong.");
            }
        })
    }

    /**
    * Show icon for given status
    */
    function setStatus (status) {
        _.each(statusElements, function (el, name) {
            if (name === status) {
                el.style.display = 'inline-block';
            } else {
                el.style.display = 'none';
            }
        })
    }


  /**
   * Check if slug is already in use.
   * Resolves to 'true' if there are entries of the given content type that have
   * the same 'slug' value.
   */
    function getDuplicates (slug) {
        if (!slug) {
           return Promise.resolve(false);
        }

        return api.space.getEntries({
            'query': slug
        }).then(res => {

            let items = res.items.filter(item => {

                // If its not the current page, if the current region matches and if the item has a navigationName field
                if(item.sys.id != api.entry.getSys().id && (item.fields.region && currentRegion.getValue() == item.fields.region['sv-SE']) && (item.fields.navigationName && item.fields.navigationName['sv-SE'] == slug)){
                    return item;
                }
            })

            return { hasDuplicates: items.length > 0, dupliactes: items };
        });
    }
});
