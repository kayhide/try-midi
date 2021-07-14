{ overlays ? []
}@args:

let
  inherit (nixpkgs) pkgs;

  nodejs-overlay = self: super: {
    my-nodejs = self.nodejs-14_x;
    my-yarn = super.yarn.override {
      nodejs = self.my-nodejs;
    };
  };

  env-overlay = self: super: {
    my-env = super.buildEnv {
      name = "my-env";
      paths = with self; [
        gnumake
        fluidsynth
        soundfont-fluid
        qsynth
        overmind

        my-nodejs
        my-yarn
      ];
    };
  };

  nixpkgs = import <nixpkgs> (args // {
    overlays = overlays ++ [
      nodejs-overlay
      env-overlay
    ];
  });

in

pkgs.mkShell {
  buildInputs = with pkgs; [
    my-env
  ];

  shellHook = ''
    export "SOUNDFONTS_DIR=${pkgs.soundfont-fluid}/share/soundfonts"
  '';
}
