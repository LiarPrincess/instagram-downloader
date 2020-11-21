import { join } from 'path';
import { default as axios } from 'axios';
import { promises as fs, createWriteStream } from 'fs';

import * as instagram from './instagram';

const outputDir = './output';

(async () => {
  try {
    // const user = await instagram.authenticateAsGuest();
    const user = { csrfToken: 'rv096hdWPhh4xEJlIjcmp93t5S9fFso6' };
    // const profile = await instagram.getProfile(user, 'best.dressed');
    const profileId = '4619773314';
    const media = await instagram.getProfileMedia(user, profileId);

    // self.session.headers.update({'X-CSRFToken': req.cookies['csrftoken']})
    // self.session.headers.update({'user-agent': CHROME_WIN_UA})
    // ================ END ================

    // const file = './instagram-saved.html';

    // console.log(`Parsing '${file}' html file`);
    // const html = await fs.readFile(file, 'utf-8');
    // const savedPosts = parseSavedPosts(html);
    // console.log(`  Found ${savedPosts.length} posts`);

    // for (const savedPost of savedPosts) {
    //   const url = savedPost.url;
    //   console.log('Processing:', url);

    //   console.log('  Parsing post');
    //   const post = await getPost(url);
    //   console.log(`  Found: ${post.shortCode}`);
    //   console.log(`  Owner: ${post.owner.full_name} (username: ${post.owner.username})`);
    //   console.log(`  Taken at: ${post.takenAt.toISOString()}`);

    //   async function download(sources: ImageSource[], filenameSuffix: string) {
    //     const filename = createFilename(post, filenameSuffix);
    //     const file = join(outputDir, filename);
    //     console.log(`  Creating ${filename}`);

    //     const source = getImageWithHighestResolution(post, sources);
    //     await downloadBinary(file, source.url);
    //   }

    //   switch (post.content.type) {
    //     case 'SingleImage':
    //       const sources = post.content.sources;
    //       await download(sources, '');
    //       break;

    //     case 'MultipleImage':
    //       const images = post.content.images;
    //       for (let i = 0; i < images.length; i++) {
    //         const image = images[i];
    //         const suffix = `-${i + 1}`;
    //         await download(image.sources, suffix);
    //       }
    //       break;

    //     default:
    //       throw new Error(`Unknown post type.`);
    //   }
    // }

    console.log('Finished');
  } catch (error) {
    console.log(error.stack);
    process.exit(1);
  }
})();

// function createFilename(post: Post, suffix: string): string {
//   const username = post.owner.username;

//   const dateISO = post.takenAt.toISOString();
//   const minutesEnd = 16;
//   const date = dateISO.substring(0, minutesEnd).replace('T', ' ').replace(':', '');

//   return `${username}-${date}${suffix}.jpg`;
// }

// function getImageWithHighestResolution(post: Post, sources: ImageSource[]): ImageSource {
//   if (sources.length == 0) {
//     throw new Error(`No image sources found for '${post.url}'.`);
//   }

//   let result = sources[0];
//   for (const source of sources) {
//     if (source.width > result.width) {
//       result = source;
//     }
//   }

//   return result;
// }

// async function downloadBinary(file: string, url: string) {
//   const writer = createWriteStream(file);

//   const response = await axios.request({
//     url,
//     method: 'GET',
//     responseType: 'stream',
//   });

//   response.data.pipe(writer);

//   return new Promise((resolve, reject) => {
//     writer.on('finish', resolve);
//     writer.on('error', reject);
//   });
// }
