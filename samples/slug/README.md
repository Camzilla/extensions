Updated Slug Generator
--------------

![slug-widget](http://i.imgur.com/zXnPjca.png)

![slug-widget](http://i.imgur.com/TClQNg2.png)

###Updated Contentful UI Extension.

Slug is no longer auto generated (which was dangerous, as unexpected behavior could occur).

* Added "Get URL from field"-button that fetches the data from either `Title` or `Heading` fields.
* Added "Manually generate URL"-button that generates url from input field. Is Swedish/Norweigan/Danish adapted to translate `å/Å -> a` `ä/Ä -> a` `æ/Æ -> a` `ö/Ö -> o` `ø/Ø -> o`. Other URL behavior is from [speakurl](https://github.com/pid/speakingurl).

**Instead of using contentfuls unique requirement, the extension now checks all content types (that has a slug field) for duplicates but only content that has the region field value (to allow same urls in different languages).**

~~This extension enables to generate a slug using the title of the entry.
It also checks whether or not any duplicates across the other entries of the
same content type exist to warn users before publishing.~~

~~Note In order to prevent publication whenever another entry has the same
value for the field, it is advised to use the "Uniqueness" validation constraint.
It can be combined with this extension.~~

### Installation steps

~~Ensure you checked the samples requirements listed here.~~

Install dependencies if not done already through `npm install`.

Since makefile doesnt work on windows, betterScripts was added to package.json to handle creation and update. See the extension.json for required file for create/update.

###Creating and updating (after concatinating the file and inputting your space and AT), is done by:

```
> npm run create
```

### Updating the extension
```
> npm run create
```

~~You then need to update the Makefile uncomment and update the
following lines:
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<your token>
export SPACE=<id of space you want to install the extension for>
Then do the following:
bash
make create
Updating the extension
If you make any changes to the code of the extension, you may push these updates
to Contentful by calling:
make update
Debugging in local environment
If you wish to run the extension from your local environment for debugging
purposes, you may use the following commands:
make update-dev
make serve~~
